import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [stats, setStats] = useState(null);

  const [userLoading, setUserLoading] = useState(true);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const API = "https://mindcare-ai-hesy.onrender.com";


  // =====================================
  // LOAD ALL ADMIN DATA
  // =====================================

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchFeedback();
  }, []);


  // =====================================
  // FETCH STATS
  // =====================================

  async function fetchStats() {
    try {
      setStatsLoading(true);

      const response = await fetch(
        `${API}/api/admin/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load statistics"
        );
      }

      setStats(data);

    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setStatsLoading(false);
    }
  }


  // =====================================
  // FETCH USERS
  // =====================================

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
        throw new Error(
          data.message || "Failed to load users"
        );
      }

      setUsers(data.users || []);

    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setUserLoading(false);
    }
  }


  // =====================================
  // FETCH FEEDBACK
  // =====================================

  async function fetchFeedback() {
    try {
      setFeedbackLoading(true);

      const response = await fetch(
        `${API}/api/admin/feedback`,
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


  // =====================================
  // UPDATE FEEDBACK STATUS
  // =====================================

  async function updateFeedbackStatus(id, status) {
    try {
      const response = await fetch(
        `${API}/api/admin/feedback/${id}`,
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


  // =====================================
  // CALCULATIONS
  // =====================================

  const totalUsers =
    stats?.totalUsers ?? users.length;

  const verifiedUsers =
    stats?.verifiedUsers ??
    users.filter(
      (user) => user.emailVerified
    ).length;

  const totalFeedback =
    stats?.totalFeedback ?? feedback.length;

  const newFeedback =
    stats?.newFeedback ??
    feedback.filter(
      (item) => item.status === "New"
    ).length;

  const totalGames =
    stats?.totalGames ?? 0;

  const averageRating =
    stats?.averageRating ?? "0.0";


  // =====================================
  // REFRESH EVERYTHING
  // =====================================

  function refreshDashboard() {
    setError("");

    fetchStats();
    fetchUsers();
    fetchFeedback();
  }


  // =====================================
  // ERROR SCREEN
  // =====================================

  if (
    error &&
    !userLoading &&
    !feedbackLoading &&
    !statsLoading
  ) {
    return (
      <div className="admin-page">

        <div className="admin-error">

          <div className="admin-error-icon">
            ⚠️
          </div>

          <h2>
            Admin Dashboard
          </h2>

          <p>
            {error}
          </p>

          <button
            className="admin-refresh-btn"
            onClick={refreshDashboard}
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }


  // =====================================
  // MAIN DASHBOARD
  // =====================================

  return (
    <div className="admin-page">


      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <section className="admin-header">

        <div>

          <span className="admin-badge">
            🔐 ADMIN PANEL
          </span>

          <h1>
            MindCare AI Admin Dashboard
          </h1>

          <p>
            Monitor users, registrations,
            feedback and platform activity
            from one place.
          </p>

        </div>


        <button
          className="admin-refresh-btn"
          onClick={refreshDashboard}
        >
          ↻ Refresh
        </button>

      </section>



      {/* ================================= */}
      {/* STAT CARDS */}
      {/* ================================= */}

      <section className="admin-stats">


        {/* TOTAL USERS */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            👥
          </div>

          <div>

            <span>
              Total Registrations
            </span>

            <strong>
              {statsLoading
                ? "..."
                : totalUsers}
            </strong>

          </div>

        </div>



        {/* VERIFIED USERS */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            ✅
          </div>

          <div>

            <span>
              Verified Users
            </span>

            <strong>
              {statsLoading
                ? "..."
                : verifiedUsers}
            </strong>

          </div>

        </div>



        {/* GAMES */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            🎮
          </div>

          <div>

            <span>
              Game Attempts
            </span>

            <strong>
              {statsLoading
                ? "..."
                : totalGames}
            </strong>

          </div>

        </div>



        {/* FEEDBACK */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            💬
          </div>

          <div>

            <span>
              Total Feedback
            </span>

            <strong>
              {feedbackLoading
                ? "..."
                : totalFeedback}
            </strong>

          </div>

        </div>



        {/* RATING */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            ⭐
          </div>

          <div>

            <span>
              Average Rating
            </span>

            <strong>
              {feedbackLoading
                ? "..."
                : averageRating}
            </strong>

          </div>

        </div>



        {/* NEW FEEDBACK */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            🆕
          </div>

          <div>

            <span>
              New Feedback
            </span>

            <strong>
              {feedbackLoading
                ? "..."
                : newFeedback}
            </strong>

          </div>

        </div>

      </section>



      {/* ================================= */}
      {/* REGISTERED USERS */}
      {/* ================================= */}

      <section className="admin-section">

        <div className="admin-section-header">

          <div>

            <h2>
              👥 Registered Users
            </h2>

            <p>
              Complete registration information
              available to the administrator.
            </p>

          </div>

          <span className="admin-count">
            {totalUsers} Users
          </span>

        </div>



        {userLoading ? (

          <div className="admin-loading">
            Loading registered users...
          </div>

        ) : users.length === 0 ? (

          <div className="admin-empty">

            <span>👥</span>

            <h3>
              No users yet
            </h3>

            <p>
              New registrations will appear here.
            </p>

          </div>

        ) : (

          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>

                <tr>

                  <th>
                    User
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Phone
                  </th>

                  <th>
                    Email Status
                  </th>

                  <th>
                    Phone Status
                  </th>

                  <th>
                    Registered
                  </th>

                </tr>

              </thead>


              <tbody>

                {users.map((user) => (

                  <tr key={user._id}>

                    {/* USER */}

                    <td>

                      <div className="admin-user-cell">

                        <div className="admin-avatar">

                          {(user.name || "U")
                            .charAt(0)
                            .toUpperCase()}

                        </div>

                        <strong>
                          {user.name || "—"}
                        </strong>

                      </div>

                    </td>


                    {/* EMAIL */}

                    <td>
                      {user.email || "—"}
                    </td>


                    {/* PHONE */}

                    <td>
                      {user.phone || "—"}
                    </td>


                    {/* EMAIL STATUS */}

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


                    {/* PHONE STATUS */}

                    <td>

                      {user.phoneVerified ? (

                        <span className="status verified">
                          ✓ Verified
                        </span>

                      ) : (

                        <span className="status pending">
                          Pending
                        </span>

                      )}

                    </td>


                    {/* DATE */}

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



      {/* ================================= */}
      {/* FEEDBACK */}
      {/* ================================= */}

      <section className="admin-section">

        <div className="admin-section-header">

          <div>

            <h2>
              💬 User Feedback
            </h2>

            <p>
              Read and manage feedback submitted
              by MindCare AI users.
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

            <h3>
              No feedback yet
            </h3>

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


                {/* TOP */}

                <div className="feedback-top">

                  <div className="admin-user-cell">

                    <div className="admin-avatar">

                      {(item.userName || "U")
                        .charAt(0)
                        .toUpperCase()}

                    </div>


                    <div>

                      <strong>
                        {item.userName || "User"}
                      </strong>

                      <small>
                        {item.userEmail || "—"}
                      </small>

                    </div>

                  </div>


                  {/* RATING */}

                  <div className="feedback-rating">

                    {"⭐".repeat(
                      Number(item.rating || 0)
                    )}

                  </div>

                </div>



                {/* DETAILS */}

                <div className="feedback-details">

                  <span>

                    <b>
                      Category:
                    </b>{" "}

                    {item.category || "—"}

                  </span>


                  <span>

                    <b>
                      Game:
                    </b>{" "}

                    {item.game || "—"}

                  </span>


                  <span>

                    <b>
                      Difficulty:
                    </b>{" "}

                    {item.difficulty || "—"}

                  </span>

                </div>



                {/* MESSAGE */}

                <p className="feedback-message">

                  “{item.message || "No message"}”

                </p>



                {/* BOTTOM */}

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



                  {/* STATUS */}

                  <select
                    value={
                      item.status || "New"
                    }
                    onChange={(event) =>
                      updateFeedbackStatus(
                        item._id,
                        event.target.value
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