import { useEffect, useState } from "react";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [userLoading, setUserLoading] = useState(true);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const API = "https://mindcare-ai-hesy.onrender.com";

  useEffect(() => {
    fetchUsers();
    fetchFeedback();
  }, []);

  async function fetchUsers() {
    try {
      setUserLoading(true);

      const response = await fetch(
        `${API}/api/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load users");
      }

      setUsers(data.users || []);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setUserLoading(false);
    }
  }

  async function fetchFeedback() {
    try {
      setFeedbackLoading(true);

      const response = await fetch(
        `${API}/api/feedback/admin`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load feedback"
        );
      }

      setFeedback(data.feedback || []);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setFeedbackLoading(false);
    }
  }

  async function updateFeedbackStatus(id, status) {
    try {
      const response = await fetch(
        `${API}/api/feedback/admin/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update status"
        );
      }

      setFeedback((previous) =>
        previous.map((item) =>
          item._id === id
            ? {
                ...item,
                status: data.feedback.status,
              }
            : item
        )
      );
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  const totalUsers = users.length;

  const totalFeedback = feedback.length;

  const averageRating =
    totalFeedback > 0
      ? (
          feedback.reduce(
            (sum, item) => sum + Number(item.rating || 0),
            0
          ) / totalFeedback
        ).toFixed(1)
      : "0.0";

  const newFeedback = feedback.filter(
    (item) => item.status === "New"
  ).length;

  const verifiedUsers = users.filter(
    (user) => user.emailVerified
  ).length;

  if (error && !userLoading && !feedbackLoading) {
    return (
      <div className="admin-page">
        <div className="admin-error">
          <div className="admin-error-icon">⚠️</div>

          <h2>Admin Dashboard</h2>

          <p>{error}</p>

          <button
            className="admin-refresh-btn"
            onClick={() => {
              setError("");
              fetchUsers();
              fetchFeedback();
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">

      {/* HEADER */}

      <section className="admin-header">
        <div>
          <span className="admin-badge">
            🔐 ADMIN PANEL
          </span>

          <h1>MindCare AI Admin Dashboard</h1>

          <p>
            Monitor registrations, feedback and platform
            activity from one place.
          </p>
        </div>

        <button
          className="admin-refresh-btn"
          onClick={() => {
            setError("");
            fetchUsers();
            fetchFeedback();
          }}
        >
          ↻ Refresh
        </button>
      </section>


      {/* STAT CARDS */}

      <section className="admin-stats">

        <div className="admin-stat-card">
          <div className="admin-stat-icon">👥</div>

          <div>
            <span>Total Users</span>

            <strong>
              {userLoading ? "..." : totalUsers}
            </strong>
          </div>
        </div>


        <div className="admin-stat-card">
          <div className="admin-stat-icon">✉️</div>

          <div>
            <span>Verified Users</span>

            <strong>
              {userLoading ? "..." : verifiedUsers}
            </strong>
          </div>
        </div>


        <div className="admin-stat-card">
          <div className="admin-stat-icon">💬</div>

          <div>
            <span>Total Feedback</span>

            <strong>
              {feedbackLoading ? "..." : totalFeedback}
            </strong>
          </div>
        </div>


        <div className="admin-stat-card">
          <div className="admin-stat-icon">⭐</div>

          <div>
            <span>Average Rating</span>

            <strong>
              {feedbackLoading ? "..." : averageRating}
            </strong>
          </div>
        </div>


        <div className="admin-stat-card">
          <div className="admin-stat-icon">🆕</div>

          <div>
            <span>New Feedback</span>

            <strong>
              {feedbackLoading ? "..." : newFeedback}
            </strong>
          </div>
        </div>

      </section>


      {/* REGISTRATIONS */}

      <section className="admin-section">

        <div className="admin-section-header">
          <div>
            <h2>👥 Recent Registrations</h2>

            <p>
              Latest users registered on MindCare AI.
            </p>
          </div>

          <span className="admin-count">
            {totalUsers} Users
          </span>
        </div>


        {userLoading ? (
          <div className="admin-loading">
            Loading registrations...
          </div>
        ) : users.length === 0 ? (
          <div className="admin-empty">
            <span>👥</span>
            <h3>No users yet</h3>
            <p>
              New registrations will appear here.
            </p>
          </div>
        ) : (
          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Email Status</th>
                  <th>Registered</th>
                </tr>
              </thead>

              <tbody>

                {users.map((user) => (
                  <tr key={user._id}>

                    <td>
                      <div className="admin-user-cell">
                        <div className="admin-avatar">
                          {(user.name || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <strong>
                          {user.name}
                        </strong>
                      </div>
                    </td>

                    <td>
                      {user.email}
                    </td>

                    <td>
                      {user.phone || "—"}
                    </td>

                    <td>
                      {user.emailVerified ? (
                        <span className="status verified">
                          ✓ Verified
                        </span>
                      ) : (
                        <span className="status pending">
                          Pending
                        </span>
                      )}
                    </td>

                    <td>
                      {user.createdAt
                        ? new Date(
                            user.createdAt
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "—"}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </section>


      {/* FEEDBACK */}

      <section className="admin-section">

        <div className="admin-section-header">
          <div>
            <h2>💬 User Feedback</h2>

            <p>
              Review feedback submitted by MindCare AI users.
            </p>
          </div>

          <span className="admin-count">
            {totalFeedback} Feedback
          </span>
        </div>


        {feedbackLoading ? (
          <div className="admin-loading">
            Loading feedback...
          </div>
        ) : feedback.length === 0 ? (
          <div className="admin-empty">
            <span>💬</span>
            <h3>No feedback yet</h3>
            <p>
              User feedback will appear here.
            </p>
          </div>
        ) : (
          <div className="admin-feedback-list">

            {feedback.map((item) => (

              <div
                className="admin-feedback-card"
                key={item._id}
              >

                <div className="feedback-top">

                  <div className="admin-user-cell">

                    <div className="admin-avatar">
                      {(item.userName || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <strong>
                        {item.userName}
                      </strong>

                      <small>
                        {item.userEmail}
                      </small>
                    </div>

                  </div>


                  <div className="feedback-rating">
                    {"⭐".repeat(
                      Number(item.rating || 0)
                    )}
                  </div>

                </div>


                <div className="feedback-details">

                  <span>
                    <b>Category:</b>{" "}
                    {item.category || "—"}
                  </span>

                  <span>
                    <b>Game:</b>{" "}
                    {item.game || "—"}
                  </span>

                  <span>
                    <b>Difficulty:</b>{" "}
                    {item.difficulty || "—"}
                  </span>

                </div>


                <p className="feedback-message">
                  “{item.message}”
                </p>


                <div className="feedback-bottom">

                  <small>
                    {item.createdAt
                      ? new Date(
                          item.createdAt
                        ).toLocaleString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      : ""}
                  </small>


                  <select
                    value={item.status}
                    onChange={(e) =>
                      updateFeedbackStatus(
                        item._id,
                        e.target.value
                      )
                    }
                  >
                    <option value="New">
                      New
                    </option>

                    <option value="Reviewed">
                      Reviewed
                    </option>

                    <option value="Resolved">
                      Resolved
                    </option>
                  </select>

                </div>

              </div>

            ))}

          </div>
        )}

      </section>

    </div>
  );
}

export default AdminDashboard;