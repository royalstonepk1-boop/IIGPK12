/**
 * Full automatic migration: WordPress -> local download -> Cloudinary -> MongoDB.
 *
 * For each "portfolio" (Certificates) post:
 *   1. Reads the certificate number from the post title.
 *   2. Extracts the image URL from the post content (the image is
 *      embedded directly in content.rendered, not a featured image).
 *   3. Downloads that image to ./downloads/<number>.<ext>
 *   4. Uploads the downloaded file to Cloudinary.
 *   5. Upserts { number, imgUrl: cloudinarySecureUrl } into MongoDB.
 *
 * Usage:
 *   node scripts/migrateFromWordPress.js
 *
 * Safe to re-run: MongoDB upserts by number, and Cloudinary uploads use
 * overwrite:false so nothing is re-uploaded/duplicated. Failures are
 * collected and printed at the end, plus written to failed.json so you
 * can inspect or retry them.
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const cloudinary = require('../config/cloudinary');
const Certificate = require('../models/Certificate');

const SITE = 'https://ecomexpanding.com/iigpk';
const POST_TYPE = 'portfolio'; // confirmed working from your test
const PER_PAGE = 100;
const DOWNLOAD_DIR = path.resolve('downloads');
const CONCURRENCY = 5;
const RETRIES = 2;
const DELETE_LOCAL_AFTER_UPLOAD = true; // set false to keep local copies

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ---- Step 1: fetch every post from the WP REST API ----

async function fetchAllPosts() {
  const posts = [];
  let page = 1;

  while (true) {
    const url = `${SITE}/wp-json/wp/v2/${POST_TYPE}?per_page=${PER_PAGE}&page=${page}`;
    const res = await fetch(url);
    if (!res.ok) {
      if (page > 1) break; // ran past the last page
      throw new Error(`WordPress API error ${res.status} on page ${page}`);
    }
    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    posts.push(...batch);
    console.log(`Fetched page ${page} (${batch.length} posts, ${posts.length} total)`);
    page++;
  }

  return posts;
}

// Pulls the first <img src="..."> out of the post's rendered HTML content.
function extractImageUrl(post) {
  const html = post?.content?.rendered || '';
  const match = html.match(/<img[^>]+src="([^"]+)"/i);
  return match ? match[1] : null;
}

function extensionFromUrl(url) {
  const clean = url.split('?')[0];
  const ext = path.extname(clean);
  return ext || '.jpg';
}

// ---- Step 2: download an image to disk ----

async function downloadImage(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed (${res.status}) for ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buffer);
}

// ---- Step 3 + 4: upload to Cloudinary, save to MongoDB ----

async function migrateOne(post) {
  const number = (post.title?.rendered || '').trim();
  if (!number) throw new Error(`Post ${post.id} has no title`);

  const imageUrl = extractImageUrl(post);
  if (!imageUrl) throw new Error(`Post ${post.id} (${number}) has no image in its content`);

  const localPath = path.join(DOWNLOAD_DIR, `${number}${extensionFromUrl(imageUrl)}`);

  await downloadImage(imageUrl, localPath);

  const uploaded = await cloudinary.uploader.upload(localPath, {
    folder: 'iigpk/certificates',
    public_id: number,
    overwrite: false,
  });

  await Certificate.findOneAndUpdate(
    { number },
    { number, imgUrl: uploaded.secure_url },
    { upsert: true, new: true }
  );

  if (DELETE_LOCAL_AFTER_UPLOAD) {
    fs.unlink(localPath, () => {});
  }

  return { number, imgUrl: uploaded.secure_url };
}

async function runWithConcurrency(posts, limit) {
  const results = [];
  const failures = [];
  let index = 0;

  async function worker() {
    while (index < posts.length) {
      const current = index++;
      const post = posts[current];
      let lastErr;
      for (let attempt = 1; attempt <= RETRIES + 1; attempt++) {
        try {
          const result = await migrateOne(post);
          results.push(result);
          console.log(`[${current + 1}/${posts.length}] OK   ${result.number}`);
          lastErr = null;
          break;
        } catch (err) {
          lastErr = err;
          if (attempt <= RETRIES) await sleep(500 * attempt);
        }
      }
      if (lastErr) {
        console.error(`[${current + 1}/${posts.length}] FAIL post ${post.id}: ${lastErr.message}`);
        failures.push({ id: post.id, title: post.title?.rendered, error: lastErr.message });
      }
    }
  }

  await Promise.all(Array.from({ length: limit }, () => worker()));
  return { results, failures };
}

async function main() {
  if (!fs.existsSync(DOWNLOAD_DIR)) fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });

  console.log('Fetching posts from WordPress...');
  const posts = await fetchAllPosts();
  console.log(`\nFound ${posts.length} certificates.\n`);

  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB. Starting migration...\n');

  const { results, failures } = await runWithConcurrency(posts, CONCURRENCY);

  console.log(`\nDone. ${results.length} succeeded, ${failures.length} failed.`);

  if (failures.length) {
    const outPath = path.resolve('failed.json');
    fs.writeFileSync(outPath, JSON.stringify(failures, null, 2));
    console.log(`Failure details written to ${outPath}`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
}); 