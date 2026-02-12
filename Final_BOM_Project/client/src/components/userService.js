const fetchUser = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:7777/api/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    alert("Failed to load user");
    return null;
  }

  return await res.json();
};
