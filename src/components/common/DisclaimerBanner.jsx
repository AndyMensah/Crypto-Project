// components/common/DisclaimerBanner.jsx — Warning banner shown at the top of every page
//
// Assignment requirement: the app must clearly identify itself as a student project
// and warn users not to enter real personal or financial data.
// This component is imported in NavBar.jsx so it appears on all pages automatically.

export default function DisclaimerBanner() {
  return (
    <div
      role="banner"
      className="bg-yellow-50 border-b border-yellow-200 py-2 px-4 text-center text-sm text-yellow-800"
    >
      This is a student project created by{" "}
      <span className="font-semibold">Cheryl Abena Asantewaa Kwakye</span>. It is not
      affiliated with any real cryptocurrency platform.
    </div>
  );
}
