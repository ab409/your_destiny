import React, { useState , useRef, useEffect } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { DatePicker, ConfigProvider } from 'antd';
import { Calendar as MobileCalendar } from 'antd-mobile';
import moment from 'moment';
import zhCN from 'antd/locale/zh_CN';
import './Calendar.css';
import 'antd-mobile/es/global';
import { Lunar } from 'lunar-javascript';
import { Picker } from 'antd-mobile';


moment.locale('zh-cn')


const Calendar = () => {
  const today = moment();
  // 初始化状态时使用当天日期
  const [selectedDate, setSelectedDate] = useState(() => today);
  const [displayWeekStart, setDisplayWeekStart] = useState(() => today.clone().startOf('week'));
  const [weekDays, setWeekDays] = useState([]);
  const [lunarInfo, setLunarInfo] = useState(null);
  
  const weekRef = useRef(null);
  const startX = useRef(0);
  
  // 添加初始化农历信息的 useEffect
  useEffect(() => {
    const lunar = Lunar.fromDate(today.toDate());
    setLunarInfo({
      yearInChinese: lunar.getYearInChinese() + '年',
      monthInChinese: lunar.getMonthInChinese() + '月',
      dayInChinese: lunar.getDayInChinese(),
      ganZhi: `${lunar.getYearInGanZhi()}年   ${lunar.getMonthInGanZhi()}月   ${lunar.getDayInGanZhi()}日`,
      festivals: lunar.getFestivals(),
      jieQi: lunar.getJieQi(),
      suitable: [lunar.getDayYi()],
      avoid: [lunar.getDayJi()],
      godDirections: {
        xi: lunar.getDayPositionXiDesc(), // 喜神
        cai: lunar.getDayPositionCaiDesc(), // 财神
        fu: lunar.getDayPositionFuDesc(), // 福神
      },
      solarInfo: lunar.getSolar().getXingZuo() // 添加星座信息
    });
  }, []);

  let definedChineseLocal = {
    lang: {
      locale: 'zh_CN',
      placeholder: '请选择日期',
      rangePlaceholder: ['Start date', 'End date'],
      today: 'Today',
      now: 'Now',
      backToToday: 'Back to today',
      ok: 'Ok',
      clear: 'Clear',
      month: 'Month',
      year: 'Year',
      timeSelect: 'Select time',
      dateSelect: 'Select date',
      monthSelect: 'Choose a month',
      yearSelect: 'Choose a year',
      decadeSelect: 'Choose a decade',
      yearFormat: 'YYYY年',
      dateFormat: 'M/D/YYYY',
      dayFormat: 'D',
      dateTimeFormat: 'M/D/YYYY HH:mm:ss',
      monthFormat: 'M月',
      monthBeforeYear: true,
      previousMonth: 'Previous month (PageUp)',
      nextMonth: 'Next month (PageDown)',
      previousYear: 'Last year (Control + left)',
      nextYear: 'Next year (Control + right)',
      previousDecade: 'Last decade',
      nextDecade: 'Next decade',
      previousCentury: 'Last century',
      nextCentury: 'Next century',
    },
    timePickerLocale: {
      placeholder: 'Select time',
    },
    dateFormat: 'YYYY-MM-DD',
    dateTimeFormat: 'YYYY-MM-DD HH:mm:ss',
    weekFormat: 'YYYY-wo',
    monthFormat: 'YYYY-MM',
  };

  // 删除重复的 useEffect
  useEffect(() => {
    updateWeekDays();
  }, [displayWeekStart]); // 只保留一个 useEffect
  const handleDateClick = (e, dayInfo) => {
    e.stopPropagation();
    const lunar = Lunar.fromDate(dayInfo.date.toDate());
    setLunarInfo({
      yearInChinese: lunar.getYearInChinese() + '年',
      monthInChinese: lunar.getMonthInChinese() + '月',
      dayInChinese: lunar.getDayInChinese(),
      ganZhi: `${lunar.getYearInGanZhi()}年   ${lunar.getMonthInGanZhi()}月   ${lunar.getDayInGanZhi()}日`,
      festivals: lunar.getFestivals(),
      jieQi: lunar.getJieQi(),
      suitable: [lunar.getDayYi()],
      avoid: [lunar.getDayJi()],
      godDirections: {
        xi: lunar.getDayPositionXiDesc(), // 喜神
        cai: lunar.getDayPositionCaiDesc(), // 财神
        fu: lunar.getDayPositionFuDesc(), // 福神
      },
      solarInfo: lunar.getSolar().getXingZuo() // 添加星座信息
    });
    setSelectedDate(dayInfo.date.clone());
  };

  const updateWeekDays = () => {
    const days = [];
    const today = moment();
    
    const weekStart = displayWeekStart.clone();
    const nextWeekStart = weekStart.clone().add(7, 'days');
    
    for (let i = 0; i < 14; i++) {
      const day = (i < 7 ? weekStart : nextWeekStart).clone().add(i % 7, 'days');
      const lunar = Lunar.fromDate(day.toDate());
      days.push({
        date: day,
        lunar: lunar.getDayInChinese(),
        icon: '☯',
        isFuture: day.isAfter(today, 'day')
      });
    }
    setWeekDays(days);
  };
  
  const handleDateChange = (date) => {
    // 确保传入的日期不为空
    if(!date) {
        return;
    }
    // setSelectedDate(date || moment());
    const firstDayOfMonth = date.startOf('month');
    setSelectedDate(firstDayOfMonth);
    
    // 更新周视图
    updateWeekDays(firstDayOfMonth);
  };

  const handlePrevMonth = () => {
    const newDate = selectedDate.clone().subtract(1, 'month');
    setSelectedDate(newDate);
    setDisplayWeekStart(newDate.clone().startOf('week'));
  };

  const handleNextMonth = () => {
    const newDate = selectedDate.clone().add(1, 'month');
    setSelectedDate(newDate);
    setDisplayWeekStart(newDate.clone().startOf('week'));
  };

  // 生成年份和月份选项
  const years = Array.from({ length: 200 }, (_, i) => ({
    label: `${moment().year() - 100 + i}年`,
    value: moment().year() - 100 + i
  }));

  const months = Array.from({ length: 12 }, (_, i) => ({
    label: `${i + 1}月`,
    value: i
  }));

  const handleMonthSelect = (values) => {
    const currentDay = selectedDate.date(); // 获取当前选中的日期
    const newDate = moment().year(values[0]).month(values[1]);
    
    // 检查新月份是否有当前日期，如果没有则选择该月1号
    const daysInMonth = newDate.daysInMonth();
    if (currentDay > daysInMonth) {
      newDate.date(1);
    } else {
      newDate.date(currentDay);
    }
    
    setSelectedDate(newDate);
    setDisplayWeekStart(newDate.clone().startOf('week'));
    
    // 更新农历信息
    const lunar = Lunar.fromDate(newDate.toDate());
    setLunarInfo({
      yearInChinese: lunar.getYearInChinese() + '年',
      monthInChinese: lunar.getMonthInChinese() + '月',
      dayInChinese: lunar.getDayInChinese(),
      ganZhi: `${lunar.getYearInGanZhi()}年   ${lunar.getMonthInGanZhi()}月   ${lunar.getDayInGanZhi()}日`,
      festivals: lunar.getFestivals(),
      jieQi: lunar.getJieQi(),
      suitable: [lunar.getDayYi()],
      avoid: [lunar.getDayJi()]
    });
  };

  const [startY, setStartY] = useState(0);

  const handleTouchStart = (e) => {
    setStartY(e.touches[0].clientY);
  };

 
// 修改触摸滑动处理函数
const handleTouchMove = (e) => {
    e.preventDefault();
    const diff = startY - e.touches[0].clientY;
    const threshold = 30;
  
    if (Math.abs(diff) > threshold) {
      const newWeekStart = displayWeekStart.clone();
      if (diff > 0) {
        setDisplayWeekStart(newWeekStart.add(7, 'days'));
      } else {
        setDisplayWeekStart(newWeekStart.subtract(7, 'days'));
      }
      setStartY(e.touches[0].clientY);
    }
  };

  return (
    <ConfigProvider locale={zhCN}>
      <div className="calendar">
        <div className="calendar-header">
          <LeftOutlined onClick={handlePrevMonth} />
          <div className="month-selector" onClick={() => {
            Picker.prompt({
              columns: [years, months],
              value: [selectedDate.year(), selectedDate.month()],
              onConfirm: handleMonthSelect
            });
          }}>
            <span>{selectedDate?.format('YYYY年M月') || moment().format('YYYY年M月')}</span>
          </div>
          {/* <button className="lunar-button">显示整月</button> */}
          <RightOutlined onClick={handleNextMonth} />
        </div>
        <div className="calendar-week-container">
          <div className="weekday-headers">
            {['周日', '周一', '周二', '周三', '周四', '周五', '周六'].map(day => (
              <div key={day} className="weekday-header">{day}</div>
            ))}
          </div>
          <div 
  className="calendar-weekdays" 
  ref={weekRef} 
  onTouchStart={handleTouchStart} 
  onTouchMove={handleTouchMove}
  onTouchEnd={(e) => e.preventDefault()} // 添加触摸结束事件处理
>
            {weekDays.map((dayInfo, index) => (
              <div 
              key={index} 
              className={`weekday-item ${dayInfo.date.isSame(selectedDate, 'day') ? 'current' : ''}`}
              onClick={(e) => handleDateClick(e, dayInfo)}
              onTouchEnd={(e) => {
                e.preventDefault();
                handleDateClick(e, dayInfo);
              }}
            >
                <div className={`weekday-date ${dayInfo.date.isSame(selectedDate, 'day') ? 'selected' : ''}`}>
                  {dayInfo.date.format('D')}
                </div>
                <div className={`weekday-lunar ${dayInfo.date.isSame(selectedDate, 'day') ? 'selected' : ''}`}>
                  {dayInfo.lunar}
                </div>
                <div className={`weekday-icon ${dayInfo.isFuture ? 'future' : ''} ${dayInfo.date.isSame(selectedDate, 'day') ? 'selected' : ''}`}>
                  {dayInfo.icon}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="calendar-days">
          {/* 这里添加日期格子 */}
        </div>
        <div className="calendar-info">
          {lunarInfo && (
            <>
              <p>{lunarInfo.yearInChinese} 农历 {lunarInfo.monthInChinese}{lunarInfo.dayInChinese}</p>
              <p className="ganzhi">{lunarInfo.ganZhi}</p>
              <p>
                {lunarInfo.festivals.length > 0 && <span className="festival">{lunarInfo.festivals.join(' ')}</span>}
                {lunarInfo.jieQi && <span className="jieqi">{lunarInfo.jieQi}</span>}
              </p>
              <p className="xingzuo">星座：{lunarInfo.solarInfo}</p>
              <p>【宜】{lunarInfo.suitable.join(',')}</p>
              <p>【忌】{lunarInfo.avoid.join(',')}</p>
                <p className="god-positions">
                    <span>喜神：{lunarInfo.godDirections.xi}</span>
                    <span>财神：{lunarInfo.godDirections.cai}</span>
                    <span>福神：{lunarInfo.godDirections.fu}</span>
                </p>
            </>
          )}
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Calendar;