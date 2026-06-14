const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://octmefsgugjudmdxbyfe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jdG1lZnNndWdqdWRtZHhieWZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NzQ1ODcsImV4cCI6MjA5NjM1MDU4N30.5sVIhvjLiRIWdGbcMmqGPFeX7xBYyU567JqeEV1FJoU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*');

  if (error) {
    console.error('Error fetching admin_users:', error);
  } else {
    console.log('admin_users data:', JSON.stringify(data, null, 2));
  }
}

inspect();
