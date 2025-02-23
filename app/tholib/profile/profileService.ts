import { TholibProfile } from "./types";

export async function getTholibProfile(): Promise<TholibProfile> {
  return new Promise((resolve) =>
    setTimeout(() =>
      resolve({
        id: "T001",
        name: "Abdullah",
        email: "abdullah@example.com",
        phone: "08123456789",
        halaqahName: "Halaqah Haizum",
        halaqahCode: "HZM123",
      }),
    1000)
  );
}
