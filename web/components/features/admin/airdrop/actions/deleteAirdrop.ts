import axios from "axios";

export async function deleteAirdrop(id: string) {
  try {
    await axios.delete(`/api/airdrop`, {
      params: { id },
    });

    alert("Airdrop deleted successfully.");
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message || "Something went wrong while deleting.";
    alert(errorMessage);
    console.error("Frontend deleteAirdrop error:", error);
  }
}
