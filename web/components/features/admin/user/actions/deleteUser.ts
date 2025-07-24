import axios from "axios";

export async function deleteUser(id: String) {
  try {
    await axios.delete(`/api/user`, {
      params: {
        id,
      },
    });

    alert("Delete user is success");
  } catch (error) {
    alert("Something wrong");
    console.error(error);
  }
}
