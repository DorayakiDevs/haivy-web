import ApplicationLayout from "./layout";
import ApplicationProvider from "./provider";

export default function MainApplication() {
  return (
    <ApplicationProvider>
      <ApplicationLayout />
    </ApplicationProvider>
  );
}
