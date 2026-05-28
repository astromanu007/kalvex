import { registerStudent } from "./app/actions/auth.ts";

(async () => {
  const result = await registerStudent({
    email: "test@example.com",
    password: "Password123!",
    name: "Test User",
    phone: "1234567890",
    college: "Test College",
    branch: "CS",
    year: "1",
    city: "Test City",
    referralCode: ""
  });
  console.log('Result:', result);
})();
