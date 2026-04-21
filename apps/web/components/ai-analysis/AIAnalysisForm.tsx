"use client";
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { AIAnalysisResult } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Brain, FileText, AlertTriangle, CheckCircle2, Info, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockPatients } from '@/data/mockData';

export function AIAnalysisForm() {
  const { addAIResult, aiResults } = useApp();
  const [patientId, setPatientId] = useState('');
  const [medicalData, setMedicalData] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState<AIAnalysisResult | null>(null);

  const handleSubmit = async () => {
    if (!medicalData.trim()) return;

    setIsAnalyzing(true);
    setCurrentResult(null);

    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Generate mock AI result
    const mockResult: AIAnalysisResult = {
      id: `ai-${Date.now()}`,
      diagnosisSummary: `Based on the provided medical data and patient history, the analysis indicates potential indicators that warrant further clinical evaluation. The symptoms described suggest a pattern consistent with mild to moderate cardiovascular strain, which may be related to lifestyle factors or underlying conditions.`,
      riskLevel: Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'moderate' : 'low',
      recommendations: [
        'Schedule a comprehensive cardiovascular examination within the next 2 weeks',
        'Monitor blood pressure twice daily and maintain a log for review',
        'Consider dietary modifications to reduce sodium intake',
        'Implement a graduated exercise program under medical supervision',
        'Follow up with specialist if symptoms persist or worsen',
      ],
      analyzedAt: new Date(),
    };

    setCurrentResult(mockResult);
    addAIResult(mockResult);
    setIsAnalyzing(false);
  };

  const riskLevelConfig = {
    low: { color: 'bg-success/10 text-success border-success/20', icon: CheckCircle2 },
    moderate: { color: 'bg-warning/10 text-warning border-warning/20', icon: AlertTriangle },
    high: { color: 'bg-destructive/10 text-destructive border-destructive/20', icon: AlertTriangle },
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <Brain className="h-5 w-5 text-primary" />
            Medical Data Input
          </CardTitle>
          <CardDescription>
            Enter patient medical data for AI-powered analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patient">Select Patient (Optional)</Label>
            <Select value={patientId} onValueChange={setPatientId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {mockPatients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="medical-data">Medical Data / Symptoms</Label>
            <Textarea
              id="medical-data"
              value={medicalData}
              onChange={(e) => setMedicalData(e.target.value)}
              placeholder="Enter patient symptoms, test results, vital signs, or other relevant medical information..."
              className="min-h-[200px] resize-none"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!medicalData.trim() || isAnalyzing}
            className="w-full gradient-primary border-0"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Submit for Analysis
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <FileText className="h-5 w-5 text-primary" />
            Analysis Results
          </CardTitle>
          <CardDescription>
            AI-generated medical analysis and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-primary/20" />
                <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-primary" />
              </div>
              <p className="mt-4 font-medium text-foreground">Analyzing medical data...</p>
              <p className="text-sm text-muted-foreground">This may take a few moments</p>
            </div>
          ) : currentResult ? (
            <div className="space-y-6 animate-fade-in">
              {/* Risk Level */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Risk Assessment</span>
                <Badge className={cn('border capitalize', riskLevelConfig[currentResult.riskLevel].color)}>
                  {React.createElement(riskLevelConfig[currentResult.riskLevel].icon, { className: 'mr-1 h-3 w-3' })}
                  {currentResult.riskLevel} Risk
                </Badge>
              </div>

              <Separator />

              {/* Diagnosis Summary */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Info className="h-4 w-4 text-info" />
                  Diagnosis Summary
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {currentResult.diagnosisSummary}
                </p>
              </div>

              <Separator />

              {/* Recommendations */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Recommendations
                </h4>
                <ul className="space-y-2">
                  {currentResult.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        {index + 1}
                      </span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Analysis generated on {currentResult.analyzedAt.toLocaleString()}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="mt-4 font-medium text-foreground">No analysis yet</p>
              <p className="text-sm text-muted-foreground">
                Submit medical data to receive AI-powered analysis
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Need to import React for createElement
import React from 'react';
