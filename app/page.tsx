import ClientHomeWrapper from "../components/ClientHomeWrapper";
import ProtectedRoute from "../components/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <ClientHomeWrapper />
    </ProtectedRoute>
  );
}
