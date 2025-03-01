const apiUrl = "http://localhost:5000/users";
const userForm = document.getElementById("userForm");
const userList = document.getElementById("userList");

// ✅ Fetch and Display Users
async function fetchUsers() {
  const response = await fetch(apiUrl);
  const users = await response.json();
  userList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerHTML = `
            ${user.id}. ${user.name} (${user.email})
            <button class="edit" onclick="editUser(${user.id}, '${user.name}', '${user.email}')">Edit</button>
            <button class="delete" onclick="deleteUser(${user.id})">Delete</button>
        `;
    userList.appendChild(li);
  });
}

// ✅ Add or Update User
async function addUser(event) {
  event.preventDefault();
  const userId = document.getElementById("userId").value;
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  if (userId) {
    await fetch(`${apiUrl}/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
  } else {
    await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
  }

  userForm.reset();
  fetchUsers();
}

// ✅ Delete User
async function deleteUser(id) {
  await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
  fetchUsers();
}

// ✅ Edit User (Prefill Form)
function editUser(id, name, email) {
  document.getElementById("userId").value = id;
  document.getElementById("name").value = name;
  document.getElementById("email").value = email;
}

// ✅ Initialize
userForm.addEventListener("submit", addUser);
fetchUsers();
