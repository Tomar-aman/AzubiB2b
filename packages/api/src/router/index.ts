import userRoute from "../module/user.template/user.routes";
import authRoute from "../module/auth.template/auth.routes";
import companyRoute from "../module/company.template/company.routes";
import manageCompanyRoute from "../module/manageCompany.template/manageCompany.routes";
import policyRoute from "../module/policy.template/managePolicy.routes";
import impressumRoute from "../module/manageImpressum.template/manageImpressum.routes";
import meineDatenRoute from "../module/manageMeineDaten.template/meineDaten.routes";
import jobAlarmContentRoute from "../module/manageJobAlarmContent.template/jobAlarmContent.routes";
import jobFormContentRoute from "../module/manageJobFormContent.template/jobFormContent.routes";
import jobRoute from "../module_admin/job.template/job.routes";
import industriesRoute from "../module_admin/industries.template/industries.routes";
import jobTypesRoute from "../module_admin/jobType.template/jobType.routes";
import cityRoute from "../module_admin/city.template/city.routes";
import adminCompanyRoute from "../module_admin/adminCompany.template/adminCompany.routes";
import jobBannerRoute from "../module_admin/jobBanner.template/jobBanner.routes";
import sideMenuRoute from "../module_admin/sidemenu.template/sidemenu.routes";
import applicationRoute from "../module_admin/application.template/application.routes";
import jobAlarmRoute from "../module_admin/jobAlarm.template/jobAlarm.routes";
import manageContentRoute from "../module_admin/manageContant.template/manageContent.routes";
import contactFormRoute from "../module_admin/manageForm.template/manageForm.routes";
import registerFormRoute from "../module_admin/registerForm.template/registerForm.routes";
import sideBarContentRoute from "../module_admin/sideBar.template/sideBar.routes";
import notificationRoute from "../module_admin/notification.template/notification.routes";
import appColorRoute from "../module_admin/appColor.template/appColor.routes";
import iconRoute from "../module_admin/icon.template/icon.routes";
import newsRoute from "../module_admin/news.template/news.routes";
import appointmentFormRoute from "../module_admin/appointment.template/appointment.routes";
import privacyPolicyRoute from "../module_admin/managePolicy.template/policy.routes";
import syncRoute from "../module_admin/sync.template/sync.routes";
import fachzubiDataRoute from "../module_admin/sync.template/fachzubiData.routes";

const router = [
  // Super-admin
  {
    prefix: "/super-admin/auth",
    router: authRoute,
  },
  {
    prefix: "/super-admin",
    router: userRoute,
  },
  {
    prefix: "/super-admin",
    router: companyRoute,
  },
  {
    prefix: "/super-admin",
    router: manageCompanyRoute,
  },
  {
    prefix: "/super-admin",
    router: policyRoute
  },
  {
    prefix: "/super-admin",
    router: impressumRoute
  },
  {
    prefix: "/super-admin",
    router: meineDatenRoute
  },
  {
    prefix: "/super-admin",
    router: jobAlarmContentRoute
  },
  {
    prefix: "/super-admin",
    router: jobFormContentRoute
  },

  // Admin
  {
    prefix: "/admin",
    router: adminCompanyRoute,
  },
  {
    prefix: "/admin",
    router: jobRoute,
  },
  {
    prefix: "/admin",
    router: industriesRoute,
  },
  {
    prefix: "/admin",
    router: jobTypesRoute,
  },
  {
    prefix: "/admin",
    router: cityRoute,
  },
  {
    prefix: "/admin",
    router: jobBannerRoute,
  },
  {
    prefix: "/admin",
    router: newsRoute,
  },
  {
    prefix: "/admin",
    router: sideMenuRoute,
  },
  {
    prefix: "/admin",
    router: applicationRoute,
  },
  {
    prefix: "/admin",
    router: jobAlarmRoute,
  },
  {
    prefix: "/admin/manage_content",
    router: manageContentRoute,
  },
  {
    prefix: "/admin",
    router: sideBarContentRoute,
  },
  {
    prefix: "/admin",
    router: contactFormRoute,
  },
  {
    prefix: "/admin",
    router: registerFormRoute,
  },
  {
    prefix: "/admin",
    router: notificationRoute,
  },
  {
    prefix: "/admin",
    router: appColorRoute,
  },
  {
    prefix: "/admin",
    router: iconRoute,
  },
  {
    prefix: "/admin",
    router: appointmentFormRoute,
  },
  {
    prefix: "/admin",
    router: privacyPolicyRoute
  },
  {
    prefix: "/sync",
    router: syncRoute,
  },
  {
    prefix: "/super-admin",
    router: fachzubiDataRoute,
  },
];

export default router;
