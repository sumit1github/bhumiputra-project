from django.conf import settings
from datetime import datetime
from pytz import timezone
from datetime import timedelta


class GetDateTime:
    def __init__(self):
        # Setting Indian timezone explicitly
        time_zone = timezone('Asia/Kolkata')
        self.today = datetime.now(time_zone)
        
    # Rest of the methods remain the same
    def get_day(self):
        data = self.today.date()
        return data.day
    
    def get_month(self):
        return self.today.month
    
    def get_year(self):
        return self.today.year
    
    def get_date(self,format='yyyy-mm-dd'):
        if format == 'dd-mm-yyyy':
            return self.today.strftime('%d-%m-%Y')
        else:
            return self.today.date()
    
    def date_delta(self, step_day):
        delta = timedelta(days=int(step_day))
        new_date = self.today + delta
        return new_date.date()
    
    def get_time(self):
        data = str(self.today).split()
        return data[1][:8]
    
    def age_from_dob(self, dob):
        """
        Calculate age from date of birth.
        :param dob: datetime.date object (e.g., 1995-10-12)
        :return: int (age)
        """
        today = self.today.date()
        age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
        return int(age)
