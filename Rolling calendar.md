
## Background

I think that the calendar design where a year is broken into month has serious flaws. The time goes on and doesn't care about how you slice it. We should stop bringing the constraints of physical objects (mass-produced paper calendars) into digital world, where we can achieve much more.

Long time ago I figured that I can create custom continuous calendars for important time intervals and print them out on paper, to write on them. I was doing these from time to time even up until recent years when I discovered Obsidian. And may even still do in specific situations in the future.

Naturally, as my system of Obsidian daily notes was evolving, I needed a similar overview of a time window around current day, where I could see on the calendar everything that links to daily notes. Back then (in 2023) I used Dataview plugin. Because of some plugins' UX flaws, I didn't feel like my solution is good enough to recommend to wide audience.

Around the same time, I realized I pretty certainly have ADHD. That explains some things about my relation with time, memory and other things. Good visualization is of vital importance to me - putting upcoming and past events on a "map" helps to augment memory and time perception with spatial perception...

Now, Datacore is available for everyone, and it allows much better ergonomics of created components. So I've rewritten my calendar, with some cleanup and improvements, and can present as something that is easy to adopt and adapt by almost any Obsidian user.

Do I see this as a dedicated plugin? A dedicated plugin would be way more rigid compared to a Datacore component that can be modified any time according to shifting personal requirements. The only true organization system is the one that can grow and evolve with you. But I also would be happy to see less of bad calendars, including in plugins, if my creation shows the path to more ergonomic design.

## Requirements

- [Datacore](https://blacksmithgu.github.io/datacore/) plugin
- following files placed in the vault:
	- `obsidian/datacore/calendarDay.jsx`
	- `obsidian/datacore/calendars.css`
	- `obsidian/datacore/luxonUtils.js`
	- `obsidian/datacore/rollingDayCalendar.jsx`
	- `obsidian/datacore/rollingWeekCalendar.jsx`

_Note: there is currently no perfect way for Datacore components to use relative paths (waiting for [PR 150](https://github.com/blacksmithgu/datacore/pull/150) to be merged). Paths inside files might need to be edited according to your vault organizational structure if you put them in a different place._

## Rolling week calendar

Intent: to see few weeks ahead and behind from current (or specified) day.

It is like your monthly wall calendar with a room for notes, except you will never be in a situation when tomorrow or yesterday is on another page and can't be seen.

And it uses note linking and properties to be a live presentation of all things that you choose to be aware of, without any convoluted vault organization.

For each day cell contents see the [Calendar day](#Calendar%20day) section below.

How to use:

````
```datacorejsx
const { RollingWeekCalendar } = await dc.require("obsidian/datacore/rollingWeekCalendar.jsx");

return function View() {
    // with all defaults:
    // return <RollingWeekCalendar />

    // with explicit properties:
    return <RollingWeekCalendar date={"2025-10-21"}
                                firstWeekOffset={-2}
                                lastWeekOffset={2}
                                minWeeks={2}
                                maxWeeks={7}
                                weekStart={1}
                                showControls={true} />
}
```
````

| Property          | Optional | Default    | Description                                                                                                                   |
| ----------------- | -------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `date`            | yes      | "today"    | the "central" date from which the default interval of the calendar will be devised. Any date string that Datacore understands |
| `firstWeekOffset` | yes      | -2         | how many weeks before the week of the central date to show by default                                                         |
| `lastWeekOffset`  | yes      | 2          | how many weeks after the week of the central date to show by default                                                          |
| `minWeeks`        | yes      | 2          | when using arrow controls, don't shrink below this number of weeks, move both ends of the range instead                       |
| `maxWeeks`        | yes      | 7          | when using arrow controls, don't grow above this number of weeks, move both ends of the range instead                         |
| `weekStart`       | yes      | 1 (Monday) | weekday of the first column. 0 or 7 for Sunday                                                                                |
| `showControls`    | yes      | `true`     | show arrow buttons that allow to modify the calendar range without editing the code                                           |

What you get:

_(Note: it is only interactive when opened in Obsidian. On the web you either see it static or as a code block like above. Web preview also doesn't show note properties.)_

```datacorejsx
const { RollingWeekCalendar } = await dc.require("obsidian/datacore/rollingWeekCalendar.jsx");

return function View() {
    return <RollingWeekCalendar date={"2025-10-21"}
                                firstWeekOffset={-2}
                                lastWeekOffset={2}
                                minWeeks={2}
                                maxWeeks={7}
                                weekStart={1}
                                showControls={true} />
}
```

Screenshot: [screenshot of rolling week calendar.png](assets/screenshot%20of%20rolling%20week%20calendar.png)

## Rolling day calendar

Intent: to see few days ahead and behind from current (or specified) day.

It was a stepping stone in the development of rolling week calendar - for me that's the main reason why it is here. But it might be useful for someone else.

For each day cell contents see the [[#Calendar day]] section below.

How to use:

````
```datacorejsx
const { RollingDayCalendar } = await dc.require("obsidian/datacore/rollingDayCalendar.jsx");

return function View() {
    // with all defaults:
    // return <RollingDayCalendar />

    // with explicit properties:
    return <RollingDayCalendar date={"2025-10-21"}
                               firstDayOffset={-2}
                               lastDayOffset={4}
                               minDays={3}
                               maxDays={10}
                               showControls={true} />
}
```
````

| Property         | Optional | Default    | Description                                                                                                                                                  |
| ---------------- | -------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `date`           | yes      | "today"    | the "central" date from which the default interval of the calendar will be devised. Any date string that Datacore understands                                |
| `firstDayOffset` | yes      | -2         | how many days before the central date to show by default                                                                                                     |
| `lastDayOffset`  | yes      | 4          | how many days after the central date to show by default                                                                                                      |
| `minDays`        | yes      | 3          | when using arrow controls, don't shrink below this number of days, move both ends of the range instead                                                       |
| `maxDays`        | yes      | 10         | when using arrow controls, don't grow above this number of days, move both ends of the range instead                                                         |
| `weekStart`      | yes      | 1 (Monday) | weekday of the first column. 0 or 7 for Sunday. In case of Rolling day calendar it only affects `.this-week` CSS class (not used in the provided CSS styles) |
| `showControls`   | yes      | `true`     | show arrow buttons that allow to modify the calendar range without editing the code                                                                          |

What you get:

_(Note: it is only interactive when opened in Obsidian. On the web you either see it static or as a code block like above. Web preview also doesn't show note properties.)_

```datacorejsx
const { RollingDayCalendar } = await dc.require("obsidian/datacore/rollingDayCalendar.jsx");

return function View() {
    return <RollingDayCalendar date={"2025-10-21"} />
}
```

Screenshot: [screenshot of rolling day calendar.png](assets/screenshot%20of%20rolling%20day%20calendar.png)

## Calendar day

Both types of rolling calendar use the same component for individual day.

It has following features:
- date (top left)
	- day of the month
	- links to the daily note if it exists
		- _daily notes are assumed to have the `YYYY-MM-DD` name format_
	- the day (specified day, today by default) - bold
- month name (top center)
	- only shown for the first day of each month on screen
- note area (top right)
	- _intended to only fit couple emojis - think what makes most sense for you_
	- 📍 if the daily note contains `calendarNote` property - it will be put here
	- 📍 if any notes (except other dailies) linking to the daily note contain `calendarNote` property - all will be appended here as well, as links
		- those links won't be put into inlinks list below
			- intent: most common recurring tasks that don't require extra words, to free up the space in inlinks area for anything more special
- inlinks area
	- links to notes that link to this daily note (regardless of whether the daily note itself  exist or not)
		- _daily notes of one day before and after are not included_
	- pops out on hover to show long titles
		- _there is no way to expand outside of the code block though, afaik_
		- _it seems preferable when Page preview setting "Require Ctrl to trigger on hover" is enabled - to avoid some screen space occlusion_
	- full note paths in tooltips
- border
	- existing/non-existing daily notes - solid/dashed borders
	- today - extra outline
	- 📍 if the daily note or any note linking to it (except other dailies) contains `calendarColor` property - its value will be set as the border color
		- _use inlink colors sparingly - there is no way to resolve color conflicts_
- weekday
	- today - more contrast color
	- the weekday (same weekday as specified day) - bold

Some CSS classes explained (for custom styling):

| Class              | Description                                                                   |
| ------------------ | ----------------------------------------------------------------------------- |
| `.calendar-day`    | all calendar days have this class                                             |
| `.this-day`        | today, at the time of rendering                                               |
| `.this-weekday`    | same weekday as today                                                         |
| `.this-week`       | same week as today                                                            |
| `.this-month`      | same month as today                                                           |
| `.the-day`         | specified day, default is today                                               |
| `.the-weekday`     | same weekday as specified day                                                 |
| `.no-page`         | no daily page for this day                                                    |
| `.is-current-page` | this calendar is on the daily page of this day                                |
| `.has-inlinks`     | some pages (except for previous and next daily notes) are linking to this day |

## Links

- [obsidian-demo-vault/Rolling calendar.md at main · KillyMXI/obsidian-demo-vault](https://github.com/KillyMXI/obsidian-demo-vault/blob/main/Rolling%20calendar.md)
- [Rolling calendar](https://killymxi.github.io/obsidian-demo-vault/rolling-calendar.html) web preview
- [Rolling Calendar (using Datacore) - Share & showcase - Obsidian Forum](https://forum.obsidian.md/t/rolling-calendar-using-datacore/107093)
