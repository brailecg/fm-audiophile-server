const serverClient = require("./server");

const getAllOrders = async () => {
  const supbabase = serverClient();

  let { data: orders, error } = await supabase.from("ordres").select("");
};
