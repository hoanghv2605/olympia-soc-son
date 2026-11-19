import OrgDiagram from "../../components/OrgDiagram";

export default function StructurePage() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-12 md:pb-16">
      <h2 className="section-title">Cơ cấu tổ chức</h2>
      <div className="mt-10">
        <OrgDiagram />
      </div>
    </section>
  );
}
