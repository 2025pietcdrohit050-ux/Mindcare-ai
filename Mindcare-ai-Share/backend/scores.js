const express = require("express");
const jwt = require("jsonwebtoken");
const GameScore = require("./models/GameScore");

const router = express.Router();

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}


/* ================================
   SAVE GAME SCORE
================================ */

router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      game,
      score,
      time,
      difficulty,
    } = req.body;

    if (!game || score === undefined) {
      return res.status(400).json({
        message: "Game and score are required",
      });
    }

    const gameScore = await GameScore.create({
      userId: req.userId,
      game,
      score,
      time: time || 0,
      difficulty: difficulty || "Easy",
    });

    res.status(201).json({
      message: "Game score saved successfully",
      score: gameScore,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to save game score",
    });
  }
});


/* ================================
   GET ALL SCORES
================================ */

router.get("/", authenticateToken, async (req, res) => {
  try {
    const scores = await GameScore.find({
      userId: req.userId,
    }).sort({
      createdAt: -1,
    });

    res.json({
      scores,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch game scores",
    });
  }
});


/* ================================
   ADAPTIVE DIFFICULTY
================================ */

router.get(
  "/adaptive/:game",
  authenticateToken,
  async (req, res) => {
    try {
      const game = req.params.game;

      const recentScores = await GameScore.find({
        userId: req.userId,
        game,
      })
        .sort({
          createdAt: -1,
        })
        .limit(5);

      // No previous data
      if (recentScores.length === 0) {
        return res.json({
          game,
          difficulty: "Easy",
          reason: "No previous game data available.",
          recentAttempts: 0,
        });
      }

      const averageScore =
        recentScores.reduce(
          (total, item) => total + item.score,
          0
        ) / recentScores.length;


      let difficulty = "Easy";
      let reason = "";


      /*
        Adaptive rules

        Average score < 40
        -> Easy

        Average score 40-69
        -> Moderate

        Average score 70+
        -> Hard
      */

      if (averageScore >= 70) {
        difficulty = "Hard";

        reason =
          "Your recent performance is strong, so the challenge has been increased.";
      } else if (averageScore >= 40) {
        difficulty = "Moderate";

        reason =
          "Your recent performance is stable, so a moderate challenge is recommended.";
      } else {
        difficulty = "Easy";

        reason =
          "The challenge has been kept easier to support gradual improvement.";
      }


      res.json({
        game,
        difficulty,
        averageScore: Math.round(averageScore),
        recentAttempts: recentScores.length,
        reason,
      });

    } catch (error) {
      console.error(
        "Adaptive difficulty error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to calculate adaptive difficulty",
      });
    }
  }
);


module.exports = router;