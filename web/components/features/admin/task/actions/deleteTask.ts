import axios from "axios";

export async function deleteTask(id: String) {
  try {
    await axios.delete(`/api/tasks`, {
      params: {
        id,
      },
    });

    alert("Delete tasks is success");
  } catch (error) {
    alert("Something wrong");
    console.error(error);
  }
}
