require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const serverClient = () => {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
};
module.exports = serverClient;
