export function cn(...classes: (string | boolean | undefined)[]) {
   return classes.filter(Boolean).join(' ');
}

type Status = 'UPCOMING' | 'ACTIVE' | 'CANCELLED' | 'COMPLETED';

type CalculatedStatus = 'upcoming' | 'started' | 'cancelled' | 'completed';

export function calculateStatus(
   startDate: string,
   endDate: string,
   status: Status
): CalculatedStatus {
   const now = new Date();
   const start = new Date(startDate);
   const end = new Date(endDate);

   if (status === 'CANCELLED') return 'cancelled';
   if (status === 'COMPLETED') return 'completed';

   if (status === 'UPCOMING') return 'upcoming';

   if (status === 'ACTIVE') {
      if (now >= start && now <= end) {
         return 'started'; // now between start and end
      } else if (now < start) {
         return 'upcoming'; // bda status active mais mazal mabdach
      } else {
         return 'completed'; // active w sala waqt dialo
      }
   }

   return 'upcoming'; // fallback, for safety
}

// 1. Day/Month/Year
export function formatDateNumeric(dateString: string): string {
   const date = new Date(dateString);
   const day = date.getDate().toString().padStart(2, '0');
   const month = (date.getMonth() + 1).toString().padStart(2, '0'); // month 0-indexed
   const year = date.getFullYear();
   return `${day}/${month}/${year}`;
}

// 2. Day/MonthName/Year
export function formatDateWithShortMonth(dateString: string): string {
   const date = new Date(dateString);
   const day = date.getDate(); // بلا padStart
   const year = date.getFullYear();

   const shortMonthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
   ];
   const monthShort = shortMonthNames[date.getMonth()];

   return `${monthShort} ${day}, ${year}`;
}

// 3. Only Time (HH:MM)
export function formatTime(dateString: string): string {
   const date = new Date(dateString);
   const hours = date.getHours().toString().padStart(2, '0');
   const minutes = date.getMinutes().toString().padStart(2, '0');
   return `${hours}:${minutes}`;
}
