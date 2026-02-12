import { useEffect, useState } from "react";

function BomVersionsTest({
  productId,
  onUnauthorized,
  onSelectVersion,
  onRestore,
}) {

  const [versions, setVersions] = useState([]);
  const [message, setMessage] = useState("Loading versions...");

  useEffect(() => {
    fetchVersions();
  }, [productId]);

  const fetchVersions = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:7777/api/bom/${productId}/versions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        onUnauthorized();
        return;
      }

      if (response.status === 403) {
        setMessage("Access denied");
        return;
      }

      const data = await response.json();
      setVersions(data);
      setMessage(data.length === 0 ? "No versions found" : "");
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
  };

  return (
    <div style={{ marginTop: "20px", border: "1px solid #aaa", padding: "10px" }}>
      <h4>BOM Versions</h4>

      {message && <p>{message}</p>}

      <ul>
        {versions.map((v) => (
          <li key={v.versionNumber}>
            Version {v.versionNumber}
            <button onClick={() => onSelectVersion(v.versionNumber)}>
              View
            </button>

            <button
              style={{ marginLeft: "8px" }}
              onClick={() => onRestore(v.versionNumber)}
            >
              Restore
            </button>

          </li>
        ))}
      </ul>
    </div>
  );
}

export default BomVersionsTest;
