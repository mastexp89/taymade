export function StubPage({
  title,
  desc,
  points,
}: {
  title: string;
  desc: string;
  points: string[];
}) {
  return (
    <>
      <div className="admin-head">
        <div>
          <h1 className="admin-h1">{title}</h1>
          <p className="admin-sub">{desc}</p>
        </div>
      </div>
      <div className="admin-card">
        <p style={{ marginTop: 0, fontWeight: 600 }}>Coming next — this section will let you:</p>
        <ul className="stub-list">
          {points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
