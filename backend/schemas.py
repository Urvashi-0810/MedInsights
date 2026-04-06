from pydantic import BaseModel, Field, RootModel
from typing import List, Dict, Optional
from datetime import datetime


class StructuredDataSchema(BaseModel):
    hemoglobin: Optional[float] = None
    wbc: Optional[float] = None
    rbc: Optional[float] = None
    platelets: Optional[float] = None
    glucose_fasting: Optional[float] = None
    hba1c: Optional[float] = None
    ldl: Optional[float] = None
    hdl: Optional[float] = None
    triglycerides: Optional[float] = None
    mcv: Optional[float] = None
    systolic_bp: Optional[int] = None
    diastolic_bp: Optional[int] = None

    class Config:
        extra = "allow"


class RiskScoresSchema(BaseModel):
    overall: int = Field(..., ge=0, le=100)
    diabetes: int = Field(..., ge=0, le=100)
    heart_disease: int = Field(..., ge=0, le=100)
    anemia: int = Field(..., ge=0, le=100)
    infection: int = Field(..., ge=0, le=100)

    class Config:
        extra = "allow"


class ParameterSchema(BaseModel):
    name: str
    value: float
    unit: str
    normal_range: str
    status: str


class ParametersArraySchema(RootModel[List[ParameterSchema]]):
    pass


class AISummarySchema(BaseModel):
    summary: str
    root_causes: List[str]
    recommendations: List[str]


class HomeRemedySchema(BaseModel):
    name: str
    priority: str


class MedicineSchema(BaseModel):
    name: str
    priority: str


class RecommendationsSchema(BaseModel):
    home_remedies: List[HomeRemedySchema]
    medications: List[MedicineSchema]
    lifestyle_changes: List[str]


class MealPlanSchema(BaseModel):
    breakfast: str
    lunch: str
    dinner: str


class DietPlanSchema(BaseModel):
    calories: int
    protein: int
    carbs: int
    fiber: int
    meals: MealPlanSchema


class KeyFindingsSchema(RootModel[List[str]]):
    pass


class ReportResponseSchema(BaseModel):
    id: int
    user_id: Optional[int] = None
    file_url: str
    structured_data: StructuredDataSchema
    risk_scores: RiskScoresSchema
    parameters: List[ParameterSchema]
    key_findings: List[str]
    ai_summary: AISummarySchema
    recommendations: RecommendationsSchema
    diet_plan: DietPlanSchema
    created_at: datetime


class OverviewResponseSchema(BaseModel):
    overall_risk_score: int
    risk_level: str
    risks: Dict[str, int]
    key_findings: List[str]
    ai_summary: str


class ParametersResponseSchema(BaseModel):
    parameters: List[ParameterSchema]


class AISummaryResponseSchema(BaseModel):
    summary: str
    root_causes: List[str]
    recommendations: List[str]


class RecommendationsResponseSchema(BaseModel):
    home_remedies: List[HomeRemedySchema]
    medications: List[MedicineSchema]
    lifestyle_changes: List[str]


class DietPlanResponseSchema(BaseModel):
    calories: int
    protein: int
    carbs: int
    fiber: int
    meals: MealPlanSchema


class UploadResponseSchema(BaseModel):
    report_id: int
    message: str