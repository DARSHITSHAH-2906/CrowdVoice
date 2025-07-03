import React, { useEffect, useState } from "react";
import axios from "axios";

interface NGO {
  _id: string;
  name: string;
  description: string;
  ownerEmail: string;
  approved: boolean;
}

const AdminNgoPanel: React.FC = () => {
  const [pendingNgos, setPendingNgos] = useState<NGO[]>([]);
  const [newNgo, setNewNgo] = useState({ name: "", description: "", ownerEmail: "" });

  useEffect(() => {
    fetchPendingNgos();
  }, []);

  const fetchPendingNgos = async () => {
    // try {
    //   const res = await axios.get("/ngo/pending", { withCredentials: true });
    //   setPendingNgos(res.data);
    // } catch (err) {
    //   console.error("Failed to fetch NGOs", err);
    // }
  };

  const handleCreateNgo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/ngo/create", newNgo, { withCredentials: true });
      alert("NGO created successfully!");
      setNewNgo({ name: "", description: "", ownerEmail: "" });
      fetchPendingNgos();
    } catch (err) {
      console.error("NGO creation failed", err);
    }
  };

  const approveNgo = async (id: string) => {
    try {
      await axios.put(`/ngo/${id}/approve`, {}, { withCredentials: true });
      setPendingNgos(pendingNgos.filter((ngo) => ngo._id !== id));
    } catch (err) {
      console.error("NGO approval failed", err);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Panel: Manage NGOs</h1>

      {/* Create NGO Form */}
      <form onSubmit={handleCreateNgo} className="space-y-4 border p-4 rounded shadow mb-8">
        <h2 className="text-xl font-semibold">Create New NGO</h2>
        <input
          type="text"
          placeholder="NGO Name"
          className="w-full p-2 border rounded"
          value={newNgo.name}
          onChange={(e) => setNewNgo({ ...newNgo, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Owner Email"
          className="w-full p-2 border rounded"
          value={newNgo.ownerEmail}
          onChange={(e) => setNewNgo({ ...newNgo, ownerEmail: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          className="w-full p-2 border rounded"
          rows={3}
          value={newNgo.description}
          onChange={(e) => setNewNgo({ ...newNgo, description: e.target.value })}
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Create NGO
        </button>
      </form>

      {/* Pending NGO Approvals */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Pending NGOs</h2>
        {pendingNgos.length === 0 ? (
          <p className="text-gray-600">No pending NGOs for approval.</p>
        ) : (
          <ul className="space-y-4">
            {pendingNgos.map((ngo) => (
              <li key={ngo._id} className="border p-4 rounded shadow">
                <h3 className="text-lg font-bold">{ngo.name}</h3>
                <p>{ngo.description}</p>
                <p className="text-sm text-gray-600">Owner: {ngo.ownerEmail}</p>
                <button
                  className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
                  onClick={() => approveNgo(ngo._id)}
                >
                  Approve
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminNgoPanel;
