import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.cluster import KMeans
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix, ConfusionMatrixDisplay

# ==============================================================================
# --- 1. Path Definitions ---
# ==============================================================================
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, '..'))
DATA_PATH = os.path.join(BACKEND_DIR, 'data/telco_customer_churn.csv')
MODEL_DIR = os.path.join(BACKEND_DIR, 'models/')
VISUALS_DIR = os.path.join(BACKEND_DIR, 'reports/visuals/')

# ==============================================================================
# --- 2. Helper Functions (Our Modular "Splits") ---
# ==============================================================================

def load_and_clean_data(data_path):
    """ Loads and cleans the data. """
    print("\n--- [Helper] Loading and Cleaning Data ---\n")
    try:
        df = pd.read_csv(data_path)
    except FileNotFoundError:
        print(f"Error: Data file not found at {data_path}")
        return None
    
    df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
    df.dropna(inplace=True)
    df['Churn'] = df['Churn'].map({'Yes': 1, 'No': 0})
    df_cleaned = df.drop('customerID', axis=1)
    print(f"Data cleaned. {df_cleaned.shape[0]} rows remaining.")
    print("\n" + "="*80)
    return df_cleaned

def save_eda_plots(df_cleaned, visuals_dir):
    """
    Saves all necessary EDA plots for the frontend dashboard.
    """
    print("\n--- [Helper] Saving All EDA Plots ---\n")
    sns.set_style('whitegrid')
    
    churn_palette = {0: "#3b82f6", 1: "#f97316"} # Blue (Stayed), Orange (Churned)

    # Plot 1: Tenure vs. Churn
    plt.figure(figsize=(10, 6))
    sns.histplot(data=df_cleaned, x='tenure', hue='Churn', 
                 multiple='layer', kde=True, palette=churn_palette, 
                 hue_order=[0, 1])
    plt.title('Distribution of Tenure by Churn Status', fontsize=16)
    legend = plt.gca().get_legend()
    legend.set_title('Churn Status')
    if len(legend.texts) >= 2:
        legend.texts[0].set_text('Stayed')
        legend.texts[1].set_text('Churned')
    plt.savefig(os.path.join(visuals_dir, 'tenure_vs_churn.svg'), bbox_inches='tight')
    print("Saved tenure_vs_churn.svg")

    # Plot 2: MonthlyCharges vs. Churn
    plt.figure(figsize=(10, 6))
    sns.histplot(data=df_cleaned, x='MonthlyCharges', hue='Churn', 
                 multiple='layer', kde=True, palette=churn_palette, 
                 hue_order=[0, 1])
    plt.title('Distribution of Monthly Charges by Churn Status', fontsize=16)
    legend = plt.gca().get_legend()
    legend.set_title('Churn Status')
    if len(legend.texts) >= 2:
        legend.texts[0].set_text('Stayed')
        legend.texts[1].set_text('Churned')
    plt.savefig(os.path.join(visuals_dir, 'monthlycharges_vs_churn.svg'), bbox_inches='tight')
    print("Saved monthlycharges_vs_churn.svg")

    # --- [FIX 2: Updated Legend Logic] ---
    # Plot 3: TotalCharges vs. Churn
    plt.figure(figsize=(10, 6))
    sns.histplot(data=df_cleaned, x='TotalCharges', hue='Churn', 
                 multiple='layer', kde=True, palette=churn_palette, 
                 hue_order=[0, 1])
    plt.title('Distribution of Total Charges by Churn Status', fontsize=16)
    legend = plt.gca().get_legend()
    legend.set_title('Churn Status')
    if len(legend.texts) >= 2:
        legend.texts[0].set_text('Stayed')
        legend.texts[1].set_text('Churned')
    plt.savefig(os.path.join(visuals_dir, 'totalcharges_vs_churn.svg'), bbox_inches='tight')
    print("Saved totalcharges_vs_churn.svg")
    
    # Plot 4: Correlation Heatmap
    plt.figure(figsize=(12, 10))
    numerical_df = df_cleaned.select_dtypes(include=np.number)
    corr = numerical_df.corr()
    sns.heatmap(corr, annot=True, fmt='.2f', cmap='coolwarm', linewidths=0.5)
    plt.title('Correlation Heatmap of Numerical Features', fontsize=16)
    plt.savefig(os.path.join(visuals_dir, 'correlation_heatmap.svg'), bbox_inches='tight')
    print("Saved correlation_heatmap.svg")
    
    plt.close('all') 
    print("All EDA plots saved.")
    print("\n" + "="*80)

def train_classifier_and_preprocessor(df_cleaned):
    """ Trains the main preprocessor and the Random Forest classifier. """
    print("\n--- [Helper] Training Classifier & Preprocessor ---\n")
    
    target_classifier = 'Churn'
    target_regressor = 'MonthlyCharges'
    features_df = df_cleaned.drop([target_classifier, target_regressor], axis=1, errors='ignore')
    numerical_features = features_df.select_dtypes(include=np.number).columns.tolist()
    categorical_features = features_df.select_dtypes(include='object').columns.tolist()

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_features),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ],
        remainder='drop'
    )
    
    X_c = features_df
    y_c = df_cleaned[target_classifier]
    X_train_c, X_test_c, y_train_c, y_test_c = train_test_split(X_c, y_c, test_size=0.2, random_state=42, stratify=y_c)
    
    preprocessor.fit(X_train_c)
    
    X_train_c_processed = preprocessor.transform(X_train_c)
    X_test_c_processed = preprocessor.transform(X_test_c)
    
    rf_model = RandomForestClassifier(random_state=42, n_estimators=100)
    rf_model.fit(X_train_c_processed, y_train_c)
    
    y_pred_c = rf_model.predict(X_test_c_processed)
    print("Random Forest Classifier Report:")
    print(classification_report(y_test_c, y_pred_c))
    
    # Calculate the accuracy score
    acc = accuracy_score(y_test_c, y_pred_c)
    
    # Print it out, formatted as a percentage
    print("\n--- Overall Model Accuracy ---")
    print(f"Accuracy: {acc * 100:.2f}%\n")

    # Save Feature Importance Plot
    try:
        feature_names = preprocessor.get_feature_names_out()
        importances = rf_model.feature_importances_
        forest_importances = pd.Series(importances, index=feature_names).sort_values(ascending=False)
        
        plt.figure(figsize=(10, 8))
        sns.barplot(x=forest_importances.head(10), y=forest_importances.head(10).index, palette='viridis', hue=forest_importances.head(10).index, legend=False)
        plt.title('Top 10 Feature Importances (Random Forest)')
        plt.savefig(os.path.join(VISUALS_DIR, 'feature_importance.svg'), bbox_inches='tight')
        print(f"Saved feature_importance.svg")
    except Exception as e:
        print(f"Error saving feature importance plot: {e}")
    plt.close()

    # Save Confusion Matrix Plot
    try:
        cm = confusion_matrix(y_test_c, y_pred_c, labels=rf_model.classes_)
        disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=['No Churn', 'Churn'])
        
        # --- [FIX 1: Updated Grid Logic] ---
        disp.plot(cmap='Blues')
        disp.ax_.grid(False)
        
        plt.title('Classifier Confusion Matrix')
        plt.savefig(os.path.join(VISUALS_DIR, 'confusion_matrix.svg'), bbox_inches='tight')
        print(f"Saved confusion_matrix.svg")
    except Exception as e:
        print(f"Error saving confusion matrix plot: {e}")
    plt.close()
    print("\n" + "="*80)
    
    return preprocessor, rf_model

def train_regressor(df_cleaned, preprocessor, visuals_dir):
    """ Trains the Linear Regression model. """
    print("\n--- [Helper] Training Regressor ---\n")
    
    target_classifier = 'Churn'
    target_regressor = 'MonthlyCharges'
    features_df = df_cleaned.drop([target_classifier, target_regressor], axis=1, errors='ignore')
    y_r = df_cleaned[target_regressor]
    
    X_r_processed = preprocessor.transform(features_df)
    
    lr_model = LinearRegression()
    lr_model.fit(X_r_processed, y_r)
    print("Linear Regression model trained.")

    # Save Regression Plot
    try:
        y_pred_r = lr_model.predict(X_r_processed)
        plt.figure(figsize=(10, 6))
        sns.scatterplot(x=y_r, y=y_pred_r, alpha=0.5)
        plt.plot([y_r.min(), y_r.max()], [y_r.min(), y_r.max()], 'r--', lw=2)
        plt.xlabel('Actual Monthly Charges')
        plt.ylabel('Predicted Monthly Charges')
        plt.title('Regression: Actual vs. Predicted')
        plt.savefig(os.path.join(VISUALS_DIR, 'regression_actual_vs_pred.svg'), bbox_inches='tight')
        print("Saved regression_actual_vs_pred.svg")
    except Exception as e:
        print(f"Error saving regression plot: {e}")
    plt.close()
    print("\n" + "="*80)
    
    return lr_model

def train_clusterer(df_cleaned, visuals_dir):
    """ Trains the K-Means clustering pipeline. """
    print("\n--- [Helper] Training Clusterer ---\n")
    cluster_features = df_cleaned[['tenure', 'MonthlyCharges']]
    
    kmeans_pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('kmeans', KMeans(n_clusters=3, random_state=42, n_init=10))
    ])
    
    kmeans_pipeline.fit(cluster_features)
    print("K-Means pipeline (Scaler + Model) trained.")

    # Save Clustering Plot
    try:
        cluster_labels = kmeans_pipeline.predict(cluster_features)
        plt.figure(figsize=(10, 6))
        sns.scatterplot(x=cluster_features['tenure'], y=cluster_features['MonthlyCharges'], hue=cluster_labels, palette='viridis', s=50, alpha=0.7)
        plt.title('K-Means Customer Segments (3 Clusters)')
        plt.xlabel('Tenure (Months)')
        plt.ylabel('Monthly Charges')
        plt.legend(title='Cluster')
        plt.savefig(os.path.join(VISUALS_DIR, 'kmeans_clusters.svg'), bbox_inches='tight')
        print(f"Saved kmeans_clusters.svg")
    except Exception as e:
        print(f"Error saving clustering plot: {e}")
    plt.close('all')
    print("\n" + "="*80)
    
    return kmeans_pipeline

def save_all_models(models_dict, model_dir):
    """ Saves all fitted models and the preprocessor. """
    print("\n--- [Helper] Saving All Models ---\n")
    for name, model in models_dict.items():
        filename = f"{name}.joblib"
        path = os.path.join(model_dir, filename)
        joblib.dump(model, path)
        print(f"Saved {name}.joblib")

# ==============================================================================
# --- 3. Main Pipeline (The "Conductor") ---
# ==============================================================================

def main_pipeline():
    """
    This is the main function that runs the entire pipeline in order.
    """
    
    print("\n" + "="*80)
    print("--- [START] DWM Training Pipeline ---")
    print("="*80)
    
    os.makedirs(MODEL_DIR, exist_ok=True)
    os.makedirs(VISUALS_DIR, exist_ok=True)

    # 1. Load Data
    df_cleaned = load_and_clean_data(DATA_PATH)
    if df_cleaned is None:
        return
    
    # 2. Save EDA Plots
    save_eda_plots(df_cleaned, VISUALS_DIR) 
    
    # 3. Train Classifier & Preprocessor
    preprocessor, rf_model = train_classifier_and_preprocessor(df_cleaned)
    
    # 4. Train Regressor
    lr_model = train_regressor(df_cleaned, preprocessor, VISUALS_DIR)
    
    # 5. Train Clusterer
    kmeans_pipeline = train_clusterer(df_cleaned, VISUALS_DIR)
    
    # 6. Save all models
    models_to_save = {
        "preprocessor": preprocessor,
        "classifier_rf": rf_model,
        "regression_linear": lr_model,
        "cluster_kmeans": kmeans_pipeline
    }
    save_all_models(models_to_save, MODEL_DIR)
    
    print("\n" + "="*80)
    print("--- [COMPLETE] Pipeline Finished Successfully ---")
    print("="*80 + "\n")

if __name__ == "__main__":
    main_pipeline()