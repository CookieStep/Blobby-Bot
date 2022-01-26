const cDatabase = require("@replit/database");
const db = new cDatabase();
db.key = "https://kv.replit.com/v0/eyJhbGciOiJIUzUxMiIsImlzcyI6ImNvbm1hbiIsImtpZCI6InByb2Q6MSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjb25tYW4iLCJleHAiOjE2NDMwOTUwNDgsImlhdCI6MTY0Mjk4MzQ0OCwiZGF0YWJhc2VfaWQiOiIwOGUwNTA2OS0xMzYzLTRkMDUtODg0Mi03Y2FjZTZiOGI5NDUifQ.w4UwHweHQtKD9sKU7Yzwv8W04cNPi_8k3V37IH2nzE-Z-BwqpTmbVfh_0nR_310DLXPE_H5O4kI_n1WPFxomoA";
module.exports = db;