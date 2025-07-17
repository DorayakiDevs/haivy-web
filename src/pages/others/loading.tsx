import { useEffect, useState } from "react";
import logo from "@assets/logo.svg";

import { Loading } from "@components/icons/loading";

const funTexts = [
  "Retrieving your health data . . .",
  "Warming up the stethoscope . . .",
  "Checking vitals . . .",
  "Scanning test results . . .",
  "Preparing your appointments . . .",
  "Assembling your care team . . .",
  "Analyzing your medical timeline . . .",
  "Loading secure patient portal . . .",
  "Applying privacy encryption . . .",
  "Double-checking your prescriptions . . .",
  "Consulting with the doctor elves . . .",
  "Charting the best path to wellness . . .",
  "Fetching your treatment history . . .",
  "Reviewing your case file . . .",
  "Taking a deep breath . . .",
  "Sanitizing our hands . . .",
  "Almost there - health doesn't rush!",
  "Verifying your information . . .",
  "Spinning up patient insights . . .",
  "Calibrating medical instruments . . .",
];

export default function FullscreenLoading(props: {
  showLogo?: boolean;
  showPlaceholder?: boolean;
}) {
  const { showLogo, showPlaceholder } = props;

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const d = 2000 + index * 500;
    const timeout = setTimeout(() => {
      setIndex((index + 1) % funTexts.length);
    }, d);

    // console.log(index, "wait time:", d);

    return () => {
      clearTimeout(timeout);
      // console.log("Clear", index);
    };
  }, [index]);

  return (
    <div className="app-wrapper center coll gap-24">
      {!showLogo || <img src={logo} width={156} />}
      <Loading type="spinner" size="xl" />

      {!showPlaceholder || (
        <div className="fade-in text-lg" key={"text-" + index}>
          {funTexts[index]}
        </div>
      )}
    </div>
  );
}
