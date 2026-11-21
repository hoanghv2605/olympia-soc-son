import PageHeader from "../../components/PageHeader";
import EventCard from "../../components/EventCard";
import { events } from "../../lib/data";

export default function EventList() {
  return (
    <>
      <PageHeader
        breadcrumb={[
          { to: "/wiki", label: "OSSPEDIA" },
          { label: "Sự kiện khác" },
        ]}
        title="Sự kiện khác"
        description="Các sự kiện Olympia Sóc Sơn tổ chức, phối hợp tổ chức hoặc tham gia ngoài các mùa thi."
      />
      <section className="mx-auto max-w-6xl px-5 pb-12 md:pb-16">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <li key={e.id} className="flex">
              <EventCard event={e} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
