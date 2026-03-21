const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/analyze", (req, res) => {
  const { error, language } = req.body;

  const err = (error || "").toLowerCase();

  let result = {
    problem: "Unknown error type",
    solution: "Check stack trace and debug manually",
    code: "// Debug using console.log and check variables",
    confidence: "Low"
  };

  if (err.includes("map")) {
    result = {
      problem: "Using map on undefined array",
      solution: "Ensure array exists before using map",
      code: "if(arr){ arr.map(x => x); }",
      confidence: "High"
    };
  }

  else if (err.includes("not defined")) {
    result = {
      problem: "Variable is not defined",
      solution: "Declare variable before using",
      code: language === "python"
        ? "x = 10\nprint(x)"
        : language === "java"
        ? "int x = 10;\nSystem.out.println(x);"
        : "let x = 10;\nconsole.log(x);",
      confidence: "High"
    };
  }

  else if (err.includes("null") || err.includes("of null")) {
    result = {
      problem: "Trying to access property of null",
      solution: "Check if object is not null before accessing",
      code: "if(obj){ console.log(obj.value); }",
      confidence: "High"
    };
  }

  else if (err.includes("fetch")) {
    result = {
      problem: "API request failed",
      solution: "Check network or API URL",
      code: "fetch(url).catch(err => console.log(err));",
      confidence: "Medium"
    };
  }

  res.json(result);
});

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});