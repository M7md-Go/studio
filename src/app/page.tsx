
'use client';

import type { ReactNode } from 'react';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock3, Moon, Sun, Trash2, Undo2, Briefcase, Building2 } from 'lucide-react'; // Removed Users2 as it's not used
import { Badge } from '@/components/ui/badge';

// Helper component for Sunrise icon as Lucide doesn't have it directly
const Sunrise = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2L12 6"/>
    <path d="M6 12L2 12"/>
    <path d="M18 12L22 12"/>
    <path d="M12 18L12 22"/>
    <path d="M4.93 4.93L7.76 7.76"/>
    <path d="M16.24 16.24L19.07 19.07"/>
    <path d="M19.07 4.93L16.24 7.76"/>
    <path d="M7.76 16.24L4.93 19.07"/>
    <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"/>
    <path d="M2 18H22"/>
  </svg>
);

type Shift = {
  id: string;
  code: string;
  hours: number;
  startTime: string;
  endTime: string;
  icon?: ReactNode;
};

const predefinedShifts: Shift[] = [
  { id: 'm', code: 'M', hours: 6, startTime: '7am', endTime: '1pm', icon: <Sunrise className="h-5 w-5" /> },
  { id: 'm1', code: 'M1', hours: 6, startTime: '8am', endTime: '2pm', icon: <Sunrise className="h-5 w-5" /> },
  { id: 'm2', code: 'M2', hours: 8, startTime: '8am', endTime: '3pm', icon: <Sunrise className="h-5 w-5 opacity-80" /> },
  { id: 'm3', code: 'M3', hours: 6, startTime: '9am', endTime: '3pm', icon: <Sunrise className="h-5 w-5" /> },
  { id: 'm4', code: 'M4', hours: 7, startTime: '9am', endTime: '4pm', icon: <Sunrise className="h-5 w-5 opacity-90" /> },
  { id: 'm5', code: 'M5', hours: 8, startTime: '8am', endTime: '4pm', icon: <Sunrise className="h-5 w-5 opacity-80" /> },
  { id: 'm6', code: 'M6', hours: 7, startTime: '7am', endTime: '2pm', icon: <Sunrise className="h-5 w-5 opacity-90" /> },
  { id: 'a1', code: 'A1', hours: 6, startTime: '2pm', endTime: '8pm', icon: <Sun className="h-5 w-5" /> },
  { id: 'a2', code: 'A2', hours: 6, startTime: '3pm', endTime: '9pm', icon: <Sun className="h-5 w-5" /> },
  { id: 'x1', code: 'X1', hours: 9, startTime: '8am', endTime: '5pm', icon: <Briefcase className="h-5 w-5" /> },
  { id: 'x2', code: 'X2', hours: 9, startTime: '9am', endTime: '6pm', icon: <Briefcase className="h-5 w-5" /> },
  { id: 'x3', code: 'X3', hours: 9, startTime: '7am', endTime: '4pm', icon: <Briefcase className="h-5 w-5" /> },
  { id: 'x4', code: 'X4', hours: 9, startTime: '11am', endTime: '8pm', icon: <Briefcase className="h-5 w-5" /> },
  { id: 'l1', code: 'L1', hours: 12, startTime: '8am', endTime: '8pm', icon: <Clock3 className="h-5 w-5" /> },
  { id: 'l2', code: 'L2', hours: 12, startTime: '9am', endTime: '9pm', icon: <Clock3 className="h-5 w-5" /> },
  { id: 'l3', code: 'L3', hours: 12, startTime: '7am', endTime: '7pm', icon: <Clock3 className="h-5 w-5" /> },
  { id: 'n1', code: 'N1', hours: 12, startTime: '8pm', endTime: '8am', icon: <Moon className="h-5 w-5" /> },
  { id: 'n2', code: 'N2', hours: 12, startTime: '9pm', endTime: '9am', icon: <Moon className="h-5 w-5" /> },
  { id: 'n3', code: 'N3', hours: 12, startTime: '7pm', endTime: '7am', icon: <Moon className="h-5 w-5" /> },
  { id: 'd', code: 'D', hours: 9, startTime: '8am', endTime: '5pm', icon: <Building2 className="h-5 w-5" /> },
];


export default function ShiftCalcPage() {
  const [selectedShifts, setSelectedShifts] = useState<Shift[]>([]);
  const [totalHours, setTotalHours] = useState<number>(0);
  const [history, setHistory] = useState<Shift[][]>([]);

  useEffect(() => {
    const newTotal = selectedShifts.reduce((acc, curr) => acc + curr.hours, 0);
    setTotalHours(newTotal);
  }, [selectedShifts]);

  const handleShiftClick = (shift: Shift) => {
    setHistory(prevHistory => [...prevHistory, selectedShifts]);
    setSelectedShifts(prevSelected => [...prevSelected, shift]);
  };

  const handleClear = () => {
    setHistory(prevHistory => [...prevHistory, selectedShifts]);
    setSelectedShifts([]);
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setSelectedShifts(previousState);
      setHistory(prevHistory => prevHistory.slice(0, -1));
    }
  };
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background selection:bg-primary selection:text-primary-foreground">
      <Card className="w-full max-w-md shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="bg-card border-b border-border p-4">
          <CardTitle className="text-2xl font-bold text-center text-primary">حاسبة الورديات</CardTitle>
          <CardDescription className="text-center text-muted-foreground text-sm">
            احسب إجمالي ساعات عملك بسهولة
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="p-3 rounded-lg bg-muted min-h-[80px] flex flex-col justify-between items-center shadow-inner">
            <div className="text-xs text-muted-foreground w-full text-right break-all h-6 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-transparent">
              {selectedShifts.length > 0 
                ? selectedShifts.map((s, i) => (
                    <Badge key={`${s.id}-${i}`} variant="secondary" className="mr-1 mb-1 text-muted-foreground">{s.code}</Badge>
                  ))
                : <span className="italic">لم يتم اختيار ورديات</span>
              }
            </div>
            <div className="text-4xl font-bold text-foreground" aria-live="polite">
              {totalHours.toLocaleString('ar-SA', { minimumFractionDigits: 0, maximumFractionDigits: 1 })}
              <span className="text-xl text-muted-foreground ml-1">ساعة</span>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {predefinedShifts.map(shift => (
              <Button
                key={shift.id}
                onClick={() => handleShiftClick(shift)}
                variant="outline"
                className="h-auto min-h-[7rem] text-xs p-1 flex flex-col items-center justify-center focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:z-10"
                aria-label={`إضافة وردية ${shift.code}, ${shift.hours} ساعات, من ${shift.startTime} إلى ${shift.endTime}`}
              >
                {shift.icon && <span className="text-primary mb-1">{shift.icon}</span>}
                <span className="font-semibold text-sm">{shift.code}</span>
                <span className="text-muted-foreground">{shift.hours} س</span>
                <span className="text-muted-foreground text-[0.65rem] whitespace-nowrap">{shift.startTime} - {shift.endTime}</span>
              </Button>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button 
              onClick={handleClear} 
              className="h-12 text-base" 
              variant="destructive"
              aria-label="مسح جميع الورديات"
            >
              <Trash2 className="mr-2 h-4 w-4" /> مسح
            </Button>
            <Button 
              onClick={handleUndo} 
              className="h-12 text-base" 
              variant="secondary" 
              disabled={history.length === 0}
              aria-label="تراجع عن آخر إضافة"
            >
              <Undo2 className="mr-2 h-4 w-4" /> تراجع
            </Button>
          </div>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground text-center block p-3 border-t border-border bg-card">
          اضغط على أزرار الورديات لإضافة الساعات. يتم تحديث الإجمالي تلقائيًا.
        </CardFooter>
      </Card>
    </main>
  );
}
