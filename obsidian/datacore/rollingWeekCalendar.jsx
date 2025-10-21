const css = await app.vault.cachedRead(
  await app.vault.getFileByPath('obsidian/datacore/calendars.css')
);

const { CalendarDay } = await dc.require('obsidian/datacore/calendarDay.jsx');
const { startOfWeek } = await dc.require('obsidian/datacore/luxonUtils.js');


function RollingWeekCalendar(props) {
  const {
    date: dateStr = "today", // any string that `dc.coerce.date()` can handle; "today" by default
    firstWeekOffset: initialFirstWeekOffset = -2,
    lastWeekOffset: initialLastWeekOffset = 2,
    minWeeks = 2,
    maxWeeks = 7,
    weekStart = 1, // 1 = Monday
    showControls = true,
  } = props;

  const [firstWeekOffset, setFirstWeekOffset] = dc.useState(initialFirstWeekOffset);
  const [lastWeekOffset, setLastWeekOffset] = dc.useState(initialLastWeekOffset);

  function decreaseFirstWeekOffset() {
    setFirstWeekOffset(firstWeekOffset - 1);
    if (lastWeekOffset - firstWeekOffset > maxWeeks) {
      setLastWeekOffset(lastWeekOffset - 1);
    }
  }

  function increaseFirstWeekOffset() {
    setFirstWeekOffset(firstWeekOffset + 1);
    if (lastWeekOffset - firstWeekOffset < minWeeks) {
      setLastWeekOffset(firstWeekOffset + minWeeks);
    }
  }

  function decreaseLastWeekOffset() {
    setLastWeekOffset(lastWeekOffset - 1);
    if (lastWeekOffset - firstWeekOffset < minWeeks) {
      setFirstWeekOffset(lastWeekOffset - minWeeks);
    }
  }

  function increaseLastWeekOffset() {
    setLastWeekOffset(lastWeekOffset + 1);
    if (lastWeekOffset - firstWeekOffset > maxWeeks) {
      setFirstWeekOffset(firstWeekOffset + 1);
    }
  }

  const baseDate = dc.coerce.date(dateStr);
  const { dateStrings, baseDateStr, baseWeekStart, firstWeekStart, lastWeekStart } = dc.useMemo(() => {
    const baseDateStr = baseDate.toFormat("yyyy-MM-dd");
    const baseWeekStart = startOfWeek(baseDate, weekStart);
    
    const firstWeekStart = baseWeekStart.plus({ weeks: firstWeekOffset });
    const lastWeekStart = baseWeekStart.plus({ weeks: lastWeekOffset });

    const dateStrings = [];
    for (let weekStart = firstWeekStart; weekStart <= lastWeekStart; weekStart = weekStart.plus({ weeks: 1 })) {
      for (let i = 0; i < 7; i++) {
        const day = weekStart.plus({ days: i });
        dateStrings.push(day.toFormat("yyyy-MM-dd"));
      }
    }

    return { dateStrings, baseDateStr, baseWeekStart, firstWeekStart, lastWeekStart };
  }, [baseDate, weekStart, firstWeekOffset, lastWeekOffset]);

  const pages = dc.useQuery(
    `@page
      and list(${dateStrings.map(ds => `"${ds}"`).join(', ')}).contains($name)
      `,
    { debounce: 100 }
  );

  const weeks = [];
  for (let weekStart = firstWeekStart; weekStart <= lastWeekStart; weekStart = weekStart.plus({ weeks: 1 })) {
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = weekStart.plus({ days: i });
      const ds = day.toFormat("yyyy-MM-dd");
      const pageForDate = pages.find(p => p.$name === ds);
      const isFirstWeek = weekStart.equals(firstWeekStart);
      const isFirstDayShown = weekStart.equals(firstWeekStart) && i === 0;
      const isFirstOfMonth = day.day === 1;
      const isTheDate = ds === baseDateStr;
      const isTheWeekday = day.weekday === baseDate.weekday;
      const className = `${isTheDate ? 'the-day' : ''} ${isTheWeekday ? 'the-weekday' : ''}`.trim();
      
      weekDays.push(
        <CalendarDay date={ds}
                     weekStart={weekStart}
                     pageForDate={pageForDate}
                     showWeekday={isFirstWeek}
                     showMonth={isFirstDayShown || isFirstOfMonth}
                     className={className}
                     />
      );
    }
    weeks.push(
      <div class="rolling-week-calendar__week"
           data-week-offset={weekStart.diff(baseWeekStart, 'weeks').weeks}>
        {weekDays}
      </div>
    );
  }

  return (
    <>
      <style>{css}</style>
      <div class="rolling-week-calendar">
        <div class="rolling-week-calendar__weeks">
          {weeks}
        </div>
        {showControls && (
          <div class="rolling-week-calendar__controls">
            <div class="rolling-week-calendar__control-group">
              <button onClick={decreaseFirstWeekOffset}>▲</button>
              <button onClick={increaseFirstWeekOffset}>▼</button>
            </div>
            <div class="rolling-week-calendar__control-group">
              <button onClick={decreaseLastWeekOffset}>▲</button>
              <button onClick={increaseLastWeekOffset}>▼</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

return { RollingWeekCalendar };
