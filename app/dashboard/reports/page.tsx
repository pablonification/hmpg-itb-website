import { AdminShell } from "@/components/dashboard/admin-shell";
import { ReportWorkspace } from "@/components/dashboard/report-workspace";
import { deleteReportAction, saveReportAction } from "@/lib/actions/admin";
import { requireReportsSession } from "@/lib/auth/session";
import { filterReports, getStore } from "@/lib/repositories/content-repository";

interface DashboardReportsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function DashboardReportsPage({
  searchParams,
}: DashboardReportsPageProps) {
  const session = await requireReportsSession();
  const params = await searchParams;
  const store = await getStore();
  const currentQuery =
    typeof params.query === "string" ? params.query.trim() : "";
  const creatingNew = params.new === "1";
  const filteredReports = filterReports(store.reports, {
    ...(currentQuery ? { query: currentQuery } : {}),
  });
  const selectedSlug =
    typeof params.report === "string" ? params.report : undefined;
  const reports = filteredReports;
  const selectedReport = creatingNew
    ? undefined
    : selectedSlug
      ? (reports.find((report) => report.slug === selectedSlug) ?? reports[0])
      : reports[0];
  const message = typeof params.message === "string" ? params.message : null;

  return (
    <AdminShell pathname="/dashboard/reports" session={session}>
      <ReportWorkspace
        currentQuery={currentQuery}
        deleteAction={deleteReportAction}
        isAdmin={session.role === "admin"}
        isCreatingNew={creatingNew}
        isViewingSelectedReport={Boolean(selectedSlug)}
        key={selectedReport?.id ?? (creatingNew ? "new" : "empty")}
        message={message}
        reports={reports}
        saveAction={saveReportAction}
        selectedReport={selectedReport}
        totalReports={filteredReports.length}
      />
    </AdminShell>
  );
}
