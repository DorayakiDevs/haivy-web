export function TestPrint() {
  return (
    <div className="report">
      <header>
        <h1>🧪 Medical Test Report</h1>
        <div className="hospital-info">
          <p>
            <strong>Haivy Medical Center</strong>
          </p>
          <p>123 Health Ave, Hanoi, Vietnam</p>
          <p>Phone: +84-123-456-789</p>
        </div>
      </header>

      <section className="patient-info">
        <h2>Patient Information</h2>
        <p>
          <strong>Name:</strong> John Doe
        </p>
        <p>
          <strong>ID:</strong> P-20250715-01
        </p>
        <p>
          <strong>DOB:</strong> Jan 1, 1985
        </p>
      </section>

      <section className="test-summary">
        <h2>Test Summary</h2>

        <div className="test">
          <h3>CD4 T-Cell Count</h3>
          <p>
            <strong>Date:</strong> July 15, 2025
          </p>
          <p>
            <strong>Result:</strong> 850 cells/µL
          </p>
          <p>
            <strong>Reference Range:</strong> 200 – 1600
          </p>
          <p>
            <strong>Status:</strong> ✅ Normal
          </p>
        </div>

        <div className="test">
          <h3>HIV Drug Resistance Test</h3>
          <p>
            <strong>Date:</strong> July 12, 2025
          </p>
          <p>
            <strong>Result:</strong> Negative
          </p>
          <p>
            <strong>Notes:</strong> No mutations associated with ART resistance
            were found.
          </p>
        </div>
      </section>

      <footer>
        <p>Generated on: July 15, 2025</p>
        <p>Signed by: Dr. Jane Nguyen</p>
      </footer>
    </div>
  );
}
