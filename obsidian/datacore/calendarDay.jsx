
const { hasSameWeek } = await dc.require('obsidian/datacore/luxonUtils.js');

function CalendarDay(props) {
  const {
    date,          // string in "YYYY-MM-DD" format (assumed that it is also the name of the daily note)
    weekStart = 1, // 1 = Monday
    pageForDate,   // page object for the date, if it exists
    showWeekday = false,
    showMonth = false,
    className = '', // additional classes to add to the root element
  } = props;

  const d = dc.coerce.date(date).startOf('day');
  const prev = d.minus({ days: 1 });
  const next = d.plus({ days: 1 });
  const prevStr = prev.toFormat("yyyy-MM-dd");
  const nextStr = next.toFormat("yyyy-MM-dd");

  const today = dc.coerce.date("today");

  const pagePath = pageForDate?.$path || null;
  const pageCalendarNote = pageForDate?.value("calendarNote") || null;
  const pageCalendarColor = pageForDate?.value("calendarColor") || null;

  const currentFilePath = dc.useCurrentPath();
  const isCurrentPage = currentFilePath && pagePath === currentFilePath;

  const inlinkPages = dc.useQuery(
    `@page
      and $links.contains([[${date}]])
      and $name != "${prevStr}"
      and $name != "${nextStr}"
      `,
    { debounce: 100 }
    );

  const isDailyNote = note => /^\d{4}-\d{2}-\d{2}$/.test(note.$name);

  const promotedInlinks = [];
  const regularInlinks = [];
  for (const p of inlinkPages) {
    if (p.value("calendarNote") && !isDailyNote(p)) {
      promotedInlinks.push(p);
    } else {
      regularInlinks.push(p);
    }
  }
  const hasCalendarNote = !!pageCalendarNote || promotedInlinks.length > 0;

  const promotedLinksFragment = promotedInlinks.length > 0
    ? promotedInlinks.map((p) => (
      <a
        data-href={p.$path}
        href={`app://obsidian.md/${p.$path}`}
        className={"internal-link calendar-day__note-link"}
        target={"_blank"}
        rel={"noopener"}
        aria-label={p.$path}
        data-tooltip-position={"top"}
      >{p.value("calendarNote")}</a>
    ))
    : null;

  const customColor = pageCalendarColor
    || inlinkPages.find(p => p.value("calendarColor") && !isDailyNote(p))?.value("calendarColor")
    || null;

  const classesStr = dc.useMemo(() => {
    const cls = [
      'calendar-day',
    ];
    if (d.hasSame(today, 'day')) { cls.push('this-day'); }
    if (hasSameWeek(d, today, weekStart)) { cls.push('this-week'); }
    if (d.weekday === today.weekday) { cls.push('this-weekday'); }
    if (d.hasSame(today, 'month')) { cls.push('this-month'); }
    if (pagePath) { cls.push('has-page'); } else { cls.push('no-page'); }
    if (isCurrentPage) { cls.push('is-current-page'); }
    if (inlinkPages.length > 0) { cls.push('has-inlinks'); }
    if (className) { cls.push(className); }
    return cls.join(' ');
  }, [d, today, weekStart, pagePath, isCurrentPage, inlinkPages.length, className]);

  return (
    <div class={classesStr}
         data-date={d.toFormat("yyyy-MM-dd")}
         data-weekday={d.weekdayShort}
         data-day={d.day}
         style={customColor ? { '--calendar-day-border-color': customColor } : undefined}
         >
      <div class="calendar-day__day">
        {isCurrentPage || !pagePath ? (
          (<span class="calendar-day__date">{d.toFormat("d")}</span>)
        ) : (
          <a data-href={pagePath}
             href={pagePath}
             className={"internal-link"}
             target={"_blank"}
             rel={"noopener"}
             aria-label={pagePath}
             data-tooltip-position={"top"}
          >{d.toFormat("d")}</a>
        )}
      </div>
      <div class="calendar-day__note">
        {hasCalendarNote ? (
          <span class="calendar-day__note-text">
            {pageCalendarNote}
            {promotedLinksFragment}
          </span>
        ) : <span class="calendar-day__note-empty"></span>}
      </div>
      <div class="calendar-day__inlinks">
        {regularInlinks.length > 0 ? (
          <ul class="calendar-day__inlinks-list">
            {regularInlinks.map((p) => (
              <li class="calendar-day__inlink" key={`${p.$path}|${p.$name}`}>
                <a data-href={p.$path}
                   href={`app://obsidian.md/${p.$path}`}
                   className={"internal-link"}
                   target={"_blank"}
                   rel={"noopener"}
                   aria-label={p.$path}
                   data-tooltip-position={"top"}
                >{p.$name}</a>
              </li>
            ))}
          </ul>
        ) : (
          <div class="calendar-day__inlinks-empty"></div>
        )}
      </div>
      <div class="calendar-day__weekday">
        {showWeekday && <span class="calendar-day__weekday-text">{d.weekdayShort}</span>}
      </div>
      <div class="calendar-day__month">
        {showMonth && <span class="calendar-day__month-text">{d.monthShort}</span>}
      </div>
    </div>
  );
}

return { CalendarDay };
