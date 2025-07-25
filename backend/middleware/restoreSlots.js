import cron from 'node-cron';
import moment from 'moment';
import { Advisor } from '../models/advisor_details.js';

// Runs every 6 hours
cron.schedule('0 */6 * * *', async () => {
  try {
    const currentDay = moment().format('dddd').toLowerCase();  // e.g. 'monday'
    const currentTime = moment().format('h:mm A');              // e.g. '2:45 PM'

    const advisors = await Advisor.find({
      tempBlockedSlots: { $exists: true, $not: { $size: 0 } }
    });

    for (const advisor of advisors) {
      const stillBlocked = [];

      for (const slot of advisor.tempBlockedSlots) {
        const slotTime = moment(slot.time, 'h:mm A');
        const nowTime = moment(currentTime, 'h:mm A');

        const isToday = slot.day === currentDay;
        const isExpired = nowTime.isAfter(slotTime);

        if (isToday && isExpired) {
          // Restore the slot only if not already restored
          if (!advisor.schedule[slot.day].includes(slot.time)) {
            advisor.schedule[slot.day].push(slot.time);
          }
        } else {
          // Keep it if it's not expired
          stillBlocked.push(slot);
        }
      }

      advisor.tempBlockedSlots = stillBlocked;
      await advisor.save();
    }

    console.log('✔️ Auto-restore job executed');
  } catch (error) {
    console.error('❌ Auto-restore job failed:', error.message);
  }
});
