import cron from 'node-cron';
import moment from 'moment';
import { Advisor } from '../models/advisor_details.js';
import { Review } from '../models/rating_review.js';

// Runs every 5 min

// cron.schedule('*/5 * * * *', async () => {
//   try {
//     console.log('✅ Cron started');

//     const now = moment(); // current datetime
//     const advisors = await Advisor.find({
//       tempBlockedSlots: { $exists: true, $not: { $size: 0 } }
//     });

//     for (const advisor of advisors) {
//       const stillBlocked = [];

//       for (const slot of advisor.tempBlockedSlots) {
//         const slotTime = moment(slot.time, 'h:mm A');
//         const slotDateTime = moment().day(slot.day).set({
//           hour: slotTime.hour(),
//           minute: slotTime.minute(),
//           second: 0,
//           millisecond: 0
//         });

//         // handle wrap-around if slot.day is earlier in the week
//         if (slotDateTime.isAfter(now.clone().add(6, 'days'))) {
//           slotDateTime.subtract(7, 'days');
//         }

//         const isExpired = now.isAfter(slotDateTime);

//         if (isExpired) {
//           const timeStr = slotTime.format('h:mm A');
//           if (!advisor.schedule[slot.day].includes(timeStr)) {
//             advisor.schedule[slot.day].push(timeStr);
//             advisor.markModified('schedule');
//           }
//         } else {
//           stillBlocked.push(slot);
//         }
//       }

//       advisor.tempBlockedSlots = stillBlocked;
//       try{
//         await advisor.save()
//       }catch(err){
//         console.error("catch block in restoreSlot has error",err)
//       }
//       // await advisor.save();
//     }

//     console.log('✔️ Auto-restore job executed');
//   } catch (error) {
//     console.error('❌ Auto-restore job failed:', error.message);
//   }
// });

// // Runs every 2 Day
// cron.schedule('0 0 */2 * *', async () => {
//   try {
//     const advisors = await Advisor.find({});

//     for (const advisor of advisors) {
//       try {
//         const ratings = await Review.find({ productId: advisor._id });

//         if (ratings.length === 0) continue;

//         const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
//         const average = sum / ratings.length;

//         // Assuming Advisor schema has a 'rating' field to update
//         advisor.rating = average;
//         await advisor.save();
//       } catch (innerErr) {
//         console.error(`Error calculating rating for advisor ${advisor._id}:`, innerErr);
//       }
//     }
//   } catch (err) {
//     console.error("Error fetching advisors:", err);
//   }
// });

