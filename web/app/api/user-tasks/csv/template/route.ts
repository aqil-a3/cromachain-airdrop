import { convertToCSV } from "@/utils/paparse/csv";

export async function GET() {
  const templateData = [
    { eth_address: "0x6a9d4b37e8c29a23c8f67d9f541d21dbf4f82a9d" },
    { eth_address: "0x3c74b1aee0a54e7db6d46b52a0f89e43c5279c0f" },
    { eth_address: "0x9a8f6b27f54dcb3a718c682f4e237be2d05c41f0" },
    { eth_address: "0x4e2f5a9b8137c2f6a6e98d7d3c5b27c6d8f413c8" },
    { eth_address: "0x7f3e19ab45c68de7f23c97d1e42a9bcfe8b6d210" },
    { eth_address: "0x1b82f9e4d6c2a9473a5d0e8137b2f6d9c4a61f8b" },
    { eth_address: "0x5d1a3b9f76c2d48f9e82a7d4c6e3f19a72c8d1f0" },
    { eth_address: "0x2c8f7a9e41b6d38f5e7c2d9f8a3b1e4c9f0d73a2" },
    { eth_address: "0x8d4b2f3e19c7a6d5b8f2a9e1c4d7f36b9a2e01f7" },
    { eth_address: "0x0f9a8c7b5e4d21a6c3b9d7f2e18c4a7f5d9e23b6" },
    { eth_address: "0x6c3a7e9d5b1f48c2a9d7f6b4e2c19a7e0f3b8d5a" },
    { eth_address: "0x4b7e8c1f3a9d26b5e2f1c7a8d9b0e6f2a7c3d1e9" },
    { eth_address: "0x1a3b9d7e6f2c8a5d9b0e4c7f1a9d2e6f5c8b3a7d" },
    { eth_address: "0x7e2c4a9d5f8b1c3e9a0d7f2b6c8e4a1d9b3f6c2e" },
    { eth_address: "0x9d3a7f2e5b8c1d4a6e9b0c7f2a3d8e5c1f7b9a0d" },
    { eth_address: "0x3e7b1c9d2f5a8e6b0c4d7f2a1e9c8b5d3a7f0e2c" },
    { eth_address: "0x5a9e2c7f3b1d6c8a0e4f9b7d2c3a1f6e8b0d7c4a" },
    { eth_address: "0x8b4c7a1e9d2f5b6c3a0e7f1d9b8c2a4e6f0d1c3b" },
    { eth_address: "0x2f9d3b7e1c5a8f0d6e4b9a2c7d3f1e8c0b4a7d5f" },
    { eth_address: "0x0c8e1f3b7a5d9c2e6b4f1a7d3c9e0b5a2f8d7c1e" },
  ];

  const csv = convertToCSV(templateData);
  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=template.csv",
    },
  });
}
