import { MurabbiProfile } from "./types";

export async function getMurabbiProfile(): Promise<MurabbiProfile> {
  return new Promise((resolve) =>
    setTimeout(() =>
      resolve({
        id: "1",
        name: "Ahmad",
        email: "ahmad@example.com",
        phone: "08123456789",
        halaqahCount: 3,
      }),
    1000)
  );
}
