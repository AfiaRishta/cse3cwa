// app/court-room/page.tsx
import CourtRoomGame from "./CourtRoomGame";

export const metadata = { title: "Court Room" };

export default function Page() {
  return (
    <div style={{ padding: 16 }}>
      <h1>Court Room</h1>
      <p>Fix issues before they escalate. Use keyboard or mouse. Timer is manual.</p>
      <CourtRoomGame />
    </div>
  );
}
