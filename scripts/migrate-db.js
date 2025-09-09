#!/usr/bin/env node

// This script is used to run database migrations
require('dotenv').config({ path: '.env.local' });
require('ts-node').register();
require('./db/migrate.ts');
