
const css = await app.vault.cachedRead(
  await app.vault.getFileByPath('obsidian/datacore/calendars.css')
);

const { CalendarDay } = await dc.require('obsidian/datacore/calendarDay.jsx');


function RollingDayCalendar(props) {
  const {
    date: dateStr = "today", // any string that `dc.coerce.date()` can handle; "today" by default
    firstDayOffset: initialFirstDayOffset = -2,
    lastDayOffset: initialLastDayOffset = 4,
    minDays = 3,
    maxDays = 10,
    weekStart = 1, // 1 = Monday
    showControls = true,
  } = props;

  const [firstDayOffset, setFirstDayOffset] = dc.useState(initialFirstDayOffset);
  const [lastDayOffset, setLastDayOffset] = dc.useState(initialLastDayOffset);

  function decreaseFirstDayOffset() {
    setFirstDayOffset(firstDayOffset - 1);
    if (lastDayOffset - firstDayOffset > maxDays) {
      setLastDayOffset(lastDayOffset - 1);
    }
  }

  function increaseFirstDayOffset() {
    setFirstDayOffset(firstDayOffset + 1);
    if (lastDayOffset - firstDayOffset < minDays) {
      setLastDayOffset(firstDayOffset + minDays);
    }
  }

  function decreaseLastDayOffset() {
    setLastDayOffset(lastDayOffset - 1);
    if (lastDayOffset - firstDayOffset < minDays) {
      setFirstDayOffset(lastDayOffset - minDays);
    }
  }

  function increaseLastDayOffset() {
    setLastDayOffset(lastDayOffset + 1);
    if (lastDayOffset - firstDayOffset > maxDays) {
      setFirstDayOffset(firstDayOffset + 1);
    }
  }

  const baseDate = dc.coerce.date(dateStr);
  const { dateStrings, baseDateStr } = dc.useMemo(() => {
    const baseDateStr = baseDate.toFormat("yyyy-MM-dd");
    const startDate = baseDate.plus({ days: firstDayOffset });
    const endDate = baseDate.plus({ days: lastDayOffset });

    const dateStrings = [];
    for (let d = startDate; d <= endDate; d = d.plus({ days: 1 })) {
      dateStrings.push(d.toFormat("yyyy-MM-dd"));
    }

    return { dateStrings, baseDateStr };
  }, [baseDate, firstDayOffset, lastDayOffset]);

  const pages = dc.useQuery(
    `@page
      and list(${dateStrings.map(ds => `"${ds}"`).join(', ')}).contains($name)
      `,
    { debounce: 100 }
  );

  const days = dateStrings.map((ds, i) => {
    const d = dc.coerce.date(ds);
    const pageForDate = pages.find(p => p.$name === ds);
    const isFirstDayShown = i === 0;
    const isFirstOfMonth = d.day === 1;
    const isTheDate = ds === baseDateStr;
    const isTheWeekday = d.weekday === baseDate.weekday;
    const className = `${isTheDate ? 'the-day' : ''} ${isTheWeekday ? 'the-weekday' : ''}`.trim();
    return <CalendarDay date={ds}
                        weekStart={weekStart}
                        pageForDate={pageForDate}
                        showWeekday={true}
                        showMonth={isFirstOfMonth || isFirstDayShown}
                        className={className}
                        />;
  });

  return (
    <>
      <style>{css}</style>
      <div class="rolling-day-calendar">
        <div class="rolling-day-calendar__days">
          {days}
        </div>
        {showControls && (
          <div class="rolling-day-calendar__controls">
            <div class="rolling-day-calendar__control-group">
              <button onClick={decreaseFirstDayOffset}>◀</button>
              <button onClick={increaseFirstDayOffset}>▶</button>
            </div>
            <div class="rolling-day-calendar__control-group">
              <button onClick={decreaseLastDayOffset}>◀</button>
              <button onClick={increaseLastDayOffset}>▶</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

return { RollingDayCalendar };
