package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	corev1 "k8s.io/api/core/v1"

	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"

	metricsclient "k8s.io/metrics/pkg/client/clientset/versioned"
)

type NodeMetric struct {
	Name       string                 `json:"name"`
	NodeInfo   map[string]string      `json:"nodeInfo"`
	Addresses  string                 `json:"addresses"`
	Status     string                 `json:"status"`
	Capacity   map[string]any         `json:"capacity"`
	Conditions []corev1.NodeCondition `json:"conditions"`
}

type PodMetric struct {
	Namespace string `json:"namespace"`
	Pod       string `json:"pod"`
	CPU       int64  `json:"cpu"`
	Memory    int64  `json:"memory"`
}

type Result struct {
	Timestamp  string       `json:"timestamp"`
	Nodes      []NodeMetric `json:"nodes"`
	PodMetrics []PodMetric  `json:"podMetrics"`
	Namespaces []string     `json:"namespaces"`
}

func main() {
	kubeconfig := clientcmd.NewNonInteractiveDeferredLoadingClientConfig(
		clientcmd.NewDefaultClientConfigLoadingRules(),
		&clientcmd.ConfigOverrides{},
	)
	config, err := kubeconfig.ClientConfig()
	if err != nil {
		log.Fatalf("Erro ao carregar configuração do Kubernetes: %v", err)
	}

	clientset, err := kubernetes.NewForConfig(config)
	if err != nil {
		log.Fatalf("Erro ao criar clientset Kubernetes: %v", err)
	}

	metricsClient, err := metricsclient.NewForConfig(config)
	if err != nil {
		log.Fatalf("Erro ao criar clientset de métricas: %v", err)
	}

	ctx := context.Background()

	nodes, err := clientset.CoreV1().Nodes().List(ctx, v1.ListOptions{})
	if err != nil {
		log.Fatalf("Erro ao obter nós: %v", err)
	}

	var nodeMetrics []NodeMetric
	for _, node := range nodes.Items {
		address := ""
		for _, addr := range node.Status.Addresses {
			if addr.Type == "ExternalIP" {
				address = addr.Address
				break
			}
		}
		nodeMetrics = append(nodeMetrics, NodeMetric{
			Name:      node.Name,
			NodeInfo:  map[string]string{"kubeletVersion": node.Status.NodeInfo.KubeletVersion},
			Addresses: address,
			Status:    string(node.Status.Conditions[len(node.Status.Conditions)-1].Type),
			Capacity: map[string]any{
				"cpu":               node.Status.Capacity.Cpu().Value(),
				"memory":            ConvertToBytes(node.Status.Capacity.Memory().String()),
				"ephemeral-storage": ConvertToBytes(node.Status.Capacity.StorageEphemeral().String()),
				"pods":              node.Status.Capacity.Pods().Value(),
			},
			Conditions: node.Status.Conditions,
		})
	}

	podMetricsList, err := metricsClient.MetricsV1beta1().PodMetricses("").List(ctx, v1.ListOptions{})
	if err != nil {
		log.Fatalf("Erro ao obter métricas dos pods: %v", err)
	}

	var podMetrics []PodMetric
	for _, podMetric := range podMetricsList.Items {
		for _, container := range podMetric.Containers {
			cpuValue := container.Usage.Cpu().MilliValue()
			podMetrics = append(podMetrics, PodMetric{
				Namespace: podMetric.Namespace,
				Pod:       podMetric.Name,
				CPU:       cpuValue,
				Memory:    ConvertToBytes(container.Usage.Memory().String()),
			})
		}
	}

	nsList, err := clientset.CoreV1().Namespaces().List(ctx, v1.ListOptions{})
	if err != nil {
		log.Fatalf("Erro ao obter namespaces: %v", err)
	}

	var namespaces []string
	for _, ns := range nsList.Items {
		namespaces = append(namespaces, ns.Name)
	}

	result := Result{
		Timestamp:  time.Now().Format(time.RFC3339),
		Nodes:      nodeMetrics,
		PodMetrics: podMetrics,
		Namespaces: namespaces,
	}

	fmt.Printf("%+v\n", result)

	file, err := os.Create("metrics-k8s.json")
	if err != nil {
		log.Fatalf("Erro ao criar arquivo JSON: %v", err)
	}
	defer file.Close()

	encoder := json.NewEncoder(file)
	encoder.SetIndent("", "  ")
	if err := encoder.Encode(result); err != nil {
		log.Fatalf("Erro ao escrever JSON: %v", err)
	}

	fmt.Println("Métricas salvas em metrics-k8s.json")
}

// ConvertToBytes converts memory values with units (Ki, Mi, Gi) to bytes
func ConvertToBytes(value string) int64 {
	var num int64
	var unit string

	// Try to parse value with unit
	if n, err := fmt.Sscanf(value, "%d%s", &num, &unit); err == nil && n == 2 {
		switch unit {
		case "Ki":
			return num * 1024 // 1 KiB = 1024 bytes
		case "Mi":
			return num * 1024 * 1024 // 1 MiB = 1024 * 1024 bytes
		case "Gi":
			return num * 1024 * 1024 * 1024 // 1 GiB = 1024 * 1024 * 1024 bytes
		}
	}

	// Try to parse plain number (already in bytes)
	if n, err := strconv.ParseInt(value, 10, 64); err == nil {
		return n
	}

	// Return 0 if parsing fails
	return 0
}
