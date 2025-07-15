import cron from 'node-cron';
import moment from 'moment';
import { Advisor } from '../models/advisor_details.js';

// Runs every 5 minutes
cron.schedule('0 */6 * * *', async () => {
  try {
    const currentDay = moment().format('dddd').toLowerCase();
    const currentTime = moment().format('h:mm A');

    const advisors = await Advisor.find({
      tempBlockedSlots: { $exists: true, $not: { $size: 0 } }
    });

    for (const advisor of advisors) {
      const stillBlocked = [];

      for (const slot of advisor.tempBlockedSlots) {
        if (
          slot.day === currentDay &&
          moment(currentTime, 'h:mm A').isAfter(moment(slot.time, 'h:mm A'))
        ) {
          if (!advisor.schedule[slot.day].includes(slot.time)) {
            advisor.schedule[slot.day].push(slot.time);
          }
        } else {
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

