
'use client';

import type { ReactNode } from 'react';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Undo2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Shift = {
  id: string;
  code: string;
  hours: number;
  startTime: string;
  endTime: string;
};

const predefinedShifts: Shift[] = [
  { id: 'm', code: 'M', hours: 6, startTime: '7am', endTime: '1pm' },
  { id: 'm1', code: 'M1', hours: 6, startTime: '8am', endTime: '2pm' },
  { id: 'm2', code: 'M2', hours: 7, startTime: '8am', endTime: '3pm' },
  { id: 'm3', code: 'M3', hours: 6, startTime: '9am', endTime: '3pm' },
  { id: 'm4', code: 'M4', hours: 7, startTime: '9am', endTime: '4pm' },
  { id: 'm5', code: 'M5', hours: 8, startTime: '8am', endTime: '4pm' },
  { id: 'm6', code: 'M6', hours: 7, startTime: '7am', endTime: '2pm' },
  { id: 'a1', code: 'A1', hours: 6, startTime: '2pm', endTime: '8pm' },
  { id: 'a2', code: 'A2', hours: 6, startTime: '3pm', endTime: '9pm' },
  { id: 'x1', code: 'X1', hours: 9, startTime: '8am', endTime: '5pm' },
  { id: 'x2', code: 'X2', hours: 9, startTime: '9am', endTime: '6pm' },
  { id: 'x3', code: 'X3', hours: 9, startTime: '7am', endTime: '4pm' },
  { id: 'x4', code: 'X4', hours: 9, startTime: '11am', endTime: '8pm' },
  { id: 'l1', code: 'L1', hours: 12, startTime: '8am', endTime: '8pm' },
  { id: 'l2', code: 'L2', hours: 12, startTime: '9am', endTime: '9pm' },
  { id: 'l3', code: 'L3', hours: 12, startTime: '7am', endTime: '7pm' },
  { id: 'n1', code: 'N1', hours: 12, startTime: '8pm', endTime: '8am' },
  { id: 'n2', code: 'N2', hours: 12, startTime: '9pm', endTime: '9am' },
  { id: 'n3', code: 'N3', hours: 12, startTime: '7pm', endTime: '7am' },
  { id: 'd', code: 'D', hours: 9, startTime: '8am', endTime: '5pm' },
];


export default function ShiftCalcPage() {
  const [selectedShifts, setSelectedShifts] = useState<Shift[]>([]);
  const [totalHours, setTotalHours] = useState<number>(0);
  const [history, setHistory] = useState<Shift[][]>([]);

  // Calculator state
  const [displayValue, setDisplayValue] = useState<string>("0");
  const [operand1, setOperand1] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand2, setWaitingForOperand2] = useState<boolean>(false);

  useEffect(() => {
    const newTotal = selectedShifts.reduce((acc, curr) => acc + curr.hours, 0);
    setTotalHours(newTotal);
    // When totalHours changes due to shift selection/deselection, reset calculator to show new total
    setDisplayValue(newTotal.toString());
    setOperand1(null);
    setOperator(null);
    setWaitingForOperand2(false);
  }, [selectedShifts]);

  const handleShiftClick = (shift: Shift) => {
    setHistory(prevHistory => [...prevHistory, selectedShifts]);
    setSelectedShifts(prevSelected => [...prevSelected, shift]);
    // useEffect will handle calculator reset
  };

  const handleClear = () => {
    setHistory(prevHistory => [...prevHistory, selectedShifts]);
    setSelectedShifts([]);
    // useEffect will handle calculator reset based on selectedShifts becoming empty
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setSelectedShifts(previousState);
      setHistory(prevHistory => prevHistory.slice(0, -1));
      // useEffect will handle calculator reset based on selectedShifts changing
    }
  };

  const performCalculation = (): number | "Error" => {
    const prev = operand1;
    const current = parseFloat(displayValue);

    if (prev === null || operator === null || isNaN(current)) {
      return "Error";
    }

    switch (operator) {
      case '+':
        return prev + current;
      case '-':
        return prev - current;
      case '*':
        return prev * current;
      case '/':
        if (current === 0) {
          return "Error";
        }
        return prev / current;
      default:
        return "Error";
    }
  };

  const handleNumberClick = (number: string) => {
    if (displayValue === "Error") {
      setDisplayValue(number);
      setWaitingForOperand2(false); // If it was error, new number starts fresh
      return;
    }
    if (waitingForOperand2) {
      setDisplayValue(number);
      setWaitingForOperand2(false);
    } else {
      setDisplayValue(prev => (prev === "0" ? number : prev + number));
    }
  };

  const handleDecimalClick = () => {
    if (displayValue === "Error") {
      setDisplayValue("0.");
      setWaitingForOperand2(false);
      return;
    }
    if (waitingForOperand2) {
      setDisplayValue("0.");
      setWaitingForOperand2(false);
    } else if (!displayValue.includes(".")) {
      setDisplayValue(prev => prev + ".");
    }
  };

  const handleOperatorClick = (nextOperator: string) => {
    if (displayValue === "Error") return;

    if (operand1 !== null && operator !== null && !waitingForOperand2) {
      const result = performCalculation();
      if (result === "Error") {
        setDisplayValue("Error");
        setOperand1(null);
        setOperator(null);
        setWaitingForOperand2(false);
        return;
      }
      setDisplayValue(result.toString());
      setOperand1(result);
    } else {
       setOperand1(parseFloat(displayValue));
    }
    
    setOperator(nextOperator);
    setWaitingForOperand2(true);
  };

  const handleEqualsClick = () => {
    if (operand1 === null || operator === null || waitingForOperand2 || displayValue === "Error") {
      return;
    }

    const result = performCalculation();
    if (result === "Error") {
      setDisplayValue("Error");
    } else {
      setDisplayValue(result.toString());
    }
    setOperand1(null); // Reset operand1, calculation is complete. Result is on display.
                      // If we want chaining like 2+3=5, then +1=6, setOperand1(result)
    setOperator(null);
    setWaitingForOperand2(false);
  };
  
  const calculatorButtons = [
    { label: '7', action: () => handleNumberClick('7'), type: 'number' , aria: 'رقم سبعة'},
    { label: '8', action: () => handleNumberClick('8'), type: 'number' , aria: 'رقم ثمانية'},
    { label: '9', action: () => handleNumberClick('9'), type: 'number' , aria: 'رقم تسعة'},
    { label: '÷', action: () => handleOperatorClick('/'), type: 'operator', aria: 'عملية القسمة' },
    { label: '4', action: () => handleNumberClick('4'), type: 'number', aria: 'رقم اربعة' },
    { label: '5', action: () => handleNumberClick('5'), type: 'number', aria: 'رقم خمسة' },
    { label: '6', action: () => handleNumberClick('6'), type: 'number', aria: 'رقم ستة' },
    { label: '×', action: () => handleOperatorClick('*'), type: 'operator', aria: 'عملية الضرب' },
    { label: '1', action: () => handleNumberClick('1'), type: 'number', aria: 'رقم واحد' },
    { label: '2', action: () => handleNumberClick('2'), type: 'number', aria: 'رقم اثنان' },
    { label: '3', action: () => handleNumberClick('3'), type: 'number', aria: 'رقم ثلاثة' },
    { label: '-', action: () => handleOperatorClick('-'), type: 'operator', aria: 'عملية الطرح' },
    { label: '0', action: () => handleNumberClick('0'), type: 'number', aria: 'رقم صفر' },
    { label: '.', action: handleDecimalClick, type: 'number', aria: 'فاصلة عشرية' },
    { label: '=', action: handleEqualsClick, type: 'equals', aria: 'يساوي' },
    { label: '+', action: () => handleOperatorClick('+'), type: 'operator', aria: 'عملية الجمع' },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background selection:bg-primary selection:text-primary-foreground">
      <Card className="w-full max-w-md shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="bg-card border-b border-border p-4">
          <CardTitle className="text-2xl font-bold text-center text-primary">حاسبة الورديات</CardTitle>
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
              {displayValue === "Error" 
                ? <span className="text-destructive">خطأ</span> 
                : `${parseFloat(displayValue === "" ? "0" : displayValue).toLocaleString('ar-SA', { minimumFractionDigits: 0, maximumFractionDigits: 4 })}`}
              {displayValue !== "Error" && <span className="text-xl text-muted-foreground ml-1">ساعة</span>}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {predefinedShifts.map(shift => (
              <Button
                key={shift.id}
                onClick={() => handleShiftClick(shift)}
                variant="outline"
                className="h-auto min-h-[2.5rem] text-xs p-1 flex flex-col items-center justify-center focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:z-10"
                aria-label={`إضافة وردية ${shift.code}, من ${shift.startTime} إلى ${shift.endTime}`}
              >
                <span className="font-bold text-sm text-foreground">{shift.code}</span>
                <span className="text-muted-foreground text-[0.6rem] leading-tight text-center whitespace-nowrap">{shift.startTime} - {shift.endTime}</span>
              </Button>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button 
              onClick={handleClear} 
              className="h-10 text-base" 
              variant="destructive"
              aria-label="مسح جميع الورديات والمدخلات"
            >
              <Trash2 className="mr-2 h-4 w-4" /> مسح الكل
            </Button>
            <Button 
              onClick={handleUndo} 
              className="h-10 text-base" 
              variant="secondary" 
              disabled={history.length === 0}
              aria-label="تراجع عن آخر إضافة وردية"
            >
              <Undo2 className="mr-2 h-4 w-4" /> تراجع وردية
            </Button>
          </div>

          {/* Calculator Buttons */}
          <div className="pt-2 space-y-2">
            {Array.from({ length: 4 }).map((_, rowIndex) => (
              <div key={`calc-row-${rowIndex}`} className="grid grid-cols-4 gap-2">
                {calculatorButtons.slice(rowIndex * 4, rowIndex * 4 + 4).map(btn => (
                  <Button
                    key={btn.label}
                    onClick={btn.action}
                    variant={btn.type === 'operator' ? 'secondary' : (btn.type === 'equals' ? 'default' : 'outline')}
                    className="h-12 text-lg font-semibold focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:z-10"
                    aria-label={btn.aria}
                  >
                    {btn.label}
                  </Button>
                ))}
              </div>
            ))}
          </div>

        </CardContent>
        <CardFooter className="text-xs text-muted-foreground text-center block p-3 border-t border-border bg-card">
          اضغط على أزرار الورديات لإضافة الساعات. استخدم الآلة الحاسبة لإجراء عمليات حسابية على الإجمالي.
        </CardFooter>
      </Card>
    </main>
  );
}

