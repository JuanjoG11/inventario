
const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://shbtmkeyarqppasdpzxv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoYnRta2V5YXJxcHBhc2Rwenh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NjEzODQsImV4cCI6MjA4NzQzNzM4NH0.Z4Bqo7NHUNs736UBbSG79OEwXEPQvG9ZUrgemLEquGQ';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkData() {
    const { data: products } = await supabase.from('products').select('*').limit(10);
    console.log("--- PRODUCTS (first 10) ---");
    console.log(JSON.stringify(products, null, 2));

    const { data: inventory } = await supabase.from('inventory').select('*').limit(20);
    console.log("\n--- INVENTORY (first 20) ---");
    console.log(JSON.stringify(inventory, null, 2));
}

checkData();
