// The DB server's own clock (CURDATE()/NOW()) isn't reliable for "today":
// it runs in whatever timezone the host happens to be in (UTC on Aiven),
// which can silently disagree with the app's actual timezone by hours,
// shifting every day-boundary calculation (revision due-dates, schedule,
// streaks). Compute "today" once here, in an explicit configured timezone,
// and pass it into queries as a parameter instead of trusting CURDATE().
const APP_TIMEZONE = process.env.APP_TIMEZONE || 'Asia/Kolkata';

export function getAppToday(): string {
  // en-CA formats as YYYY-MM-DD, which is what we want.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: APP_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}
