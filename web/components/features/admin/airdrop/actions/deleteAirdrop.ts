import axios from "axios";

export async function deleteAirdrop(id: String) {
  try {
    await axios.delete(`/api/airdrop`, {
      params: {
        id,
      },
    });

    alert("Delete airdrop is success");
  } catch (error) {
    alert("Something wrong");
    console.error(error);
  }
}
