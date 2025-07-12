import cron from 'node-cron';
import moment from 'moment';
import { Advisor } from '../models/advisor_details';

// Runs every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  const currentDay = moment().format('dddd').toLowerCase(); // e.g. 'monday'
  const currentTime = moment().format('h:mm A');             // e.g. '1:00 PM'

  const advisors = await Advisor.find({});

  for (const advisor of advisors) {
    const stillBlocked = [];

    for (const slot of advisor.tempBlockedSlots) {
      // If current day and time has passed the slot
      if (
        slot.day === currentDay &&
        moment(currentTime, 'h:mm A').isAfter(moment(slot.time, 'h:mm A'))
      ) {
        // Restore to schedule if not already present
        if (!advisor.schedule[slot.day].includes(slot.time)) {
          advisor.schedule[slot.day].push(slot.time);
        }
      } else {
        stillBlocked.push(slot); // Keep if still in future
      }
    }

    advisor.tempBlockedSlots = stillBlocked;
    await advisor.save();
  }

  console.log('✔️ Auto-restore job executed');
});
