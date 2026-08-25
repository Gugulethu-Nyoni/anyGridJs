import { BaseEditor } from './BaseEditor.js';

export class DateTimeEditor extends BaseEditor {
  render() {
    const container = document.createElement('div');
    container.className = 'datetime-editor';

    let dateObj = null;

    if (this.value) {
      dateObj = new Date(this.value);

      if (Number.isNaN(dateObj.getTime())) {
        dateObj = null;
      }
    }

    const currentYear = new Date().getFullYear();

    // Year
    const yearSelect = document.createElement('select');
    yearSelect.className = 'datetime-year';
    yearSelect.setAttribute('aria-label', 'Year');

    for (
      let year = currentYear - 100;
      year <= currentYear + 10;
      year++
    ) {
      const option = document.createElement('option');
      option.value = String(year);
      option.textContent = String(year);

      if (
        dateObj &&
        dateObj.getFullYear() === year
      ) {
        option.selected = true;
      }

      yearSelect.appendChild(option);
    }

    // Month
    const monthSelect = document.createElement('select');
    monthSelect.className = 'datetime-month';
    monthSelect.setAttribute('aria-label', 'Month');

    const months = [
      'Jan', 'Feb', 'Mar', 'Apr',
      'May', 'Jun', 'Jul', 'Aug',
      'Sep', 'Oct', 'Nov', 'Dec'
    ];

    months.forEach((name, index) => {
      const option = document.createElement('option');
      option.value = String(index);
      option.textContent = name;

      if (
        dateObj &&
        dateObj.getMonth() === index
      ) {
        option.selected = true;
      }

      monthSelect.appendChild(option);
    });

    // Day
    const daySelect = document.createElement('select');
    daySelect.className = 'datetime-day';
    daySelect.setAttribute('aria-label', 'Day');

    const initialYear =
      dateObj?.getFullYear() ?? currentYear;

    const initialMonth =
      dateObj?.getMonth() ?? 0;

    const initialDay =
      dateObj?.getDate() ?? 1;

    this._selects = {
      yearSelect,
      monthSelect,
      daySelect,
      hourSelect: null,
      minuteSelect: null
    };

    this._updateDayOptions(
      initialYear,
      initialMonth,
      initialDay
    );

    // Hour
    const hourSelect = document.createElement('select');
    hourSelect.className = 'datetime-hour';
    hourSelect.setAttribute('aria-label', 'Hour');

    for (let hour = 0; hour <= 23; hour++) {
      const option = document.createElement('option');
      option.value = String(hour);
      option.textContent = String(hour).padStart(2, '0');

      if (
        dateObj &&
        dateObj.getHours() === hour
      ) {
        option.selected = true;
      }

      hourSelect.appendChild(option);
    }

    // Minute
    const minuteSelect = document.createElement('select');
    minuteSelect.className = 'datetime-minute';
    minuteSelect.setAttribute('aria-label', 'Minute');

    for (let minute = 0; minute <= 59; minute++) {
      const option = document.createElement('option');
      option.value = String(minute);
      option.textContent = String(minute).padStart(2, '0');

      if (
        dateObj &&
        dateObj.getMinutes() === minute
      ) {
        option.selected = true;
      }

      minuteSelect.appendChild(option);
    }

    this._selects.hourSelect = hourSelect;
    this._selects.minuteSelect = minuteSelect;

    // Date section
    const dateSection = document.createElement('div');
    dateSection.className = 'datetime-date-section';

    dateSection.appendChild(yearSelect);
    dateSection.appendChild(monthSelect);
    dateSection.appendChild(daySelect);

    // Time section
    const timeSection = document.createElement('div');
    timeSection.className = 'datetime-time-section';

    const separator = document.createElement('span');
    separator.className = 'datetime-separator';
    separator.textContent = ':';

    timeSection.appendChild(hourSelect);
    timeSection.appendChild(separator);
    timeSection.appendChild(minuteSelect);

    container.appendChild(dateSection);
    container.appendChild(timeSection);

    const updateValue = () => {
      const year = Number(yearSelect.value);
      const month = Number(monthSelect.value);
      const day = Number(daySelect.value);
      const hour = Number(hourSelect.value);
      const minute = Number(minuteSelect.value);

      const date = new Date(
        year,
        month,
        day,
        hour,
        minute
      );

      if (!Number.isNaN(date.getTime())) {
        this.onCommit(date.toISOString());
      }
    };

    const updateDateParts = () => {
      const year = Number(yearSelect.value);
      const month = Number(monthSelect.value);
      const day = Number(daySelect.value) || 1;

      this._updateDayOptions(
        year,
        month,
        day
      );

      updateValue();
    };

    yearSelect.addEventListener(
      'change',
      updateDateParts
    );

    monthSelect.addEventListener(
      'change',
      updateDateParts
    );

    daySelect.addEventListener(
      'change',
      updateValue
    );

    hourSelect.addEventListener(
      'change',
      updateValue
    );

    minuteSelect.addEventListener(
      'change',
      updateValue
    );

    this.element = container;
    this._updateValue = updateValue;

    return container;
  }

  _getDaysInMonth(year, month) {
    return new Date(
      year,
      month + 1,
      0
    ).getDate();
  }

  _updateDayOptions(year, month, currentDay = 1) {
    const daySelect =
      this._selects?.daySelect;

    if (!daySelect) return;

    const days =
      this._getDaysInMonth(year, month);

    const selectedDay =
      Math.min(
        currentDay || 1,
        days
      );

    daySelect.replaceChildren();

    for (let day = 1; day <= days; day++) {
      const option = document.createElement('option');

      option.value = String(day);
      option.textContent = String(day);

      if (day === selectedDay) {
        option.selected = true;
      }

      daySelect.appendChild(option);
    }
  }

  getValue() {
    if (!this._selects) {
      return null;
    }

    const year =
      Number(this._selects.yearSelect.value);

    const month =
      Number(this._selects.monthSelect.value);

    const day =
      Number(this._selects.daySelect.value);

    const hour =
      Number(this._selects.hourSelect.value);

    const minute =
      Number(this._selects.minuteSelect.value);

    const date = new Date(
      year,
      month,
      day,
      hour,
      minute
    );

    return Number.isNaN(date.getTime())
      ? null
      : date.toISOString();
  }

  setValue(value) {
    this.value = value;

    if (!this._selects || !value) {
      return;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return;
    }

    this._selects.yearSelect.value =
      String(date.getFullYear());

    this._selects.monthSelect.value =
      String(date.getMonth());

    this._updateDayOptions(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    this._selects.hourSelect.value =
      String(date.getHours());

    this._selects.minuteSelect.value =
      String(date.getMinutes());
  }

  focus() {
    this._selects?.yearSelect?.focus();
  }
}

export default DateTimeEditor;
